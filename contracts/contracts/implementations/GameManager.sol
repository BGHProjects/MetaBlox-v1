// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./libraries/SigRecovery.sol";
import "../interfaces/IGameManager.sol";
import "./MBlox.sol";
import "./MetaBlox.sol";
import "./World.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * 
 * ███╗   ███╗███████╗████████╗ █████╗ ██████╗ ██╗      ██████╗ ██╗  ██╗
 * ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔═══██╗╚██╗██╔╝
 * ██╔████╔██║█████╗     ██║   ███████║██████╔╝██║     ██║   ██║ ╚███╔╝ 
 * ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══██╗██║     ██║   ██║ ██╔██╗ 
 * ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██████╔╝███████╗╚██████╔╝██╔╝ ██╗
 * ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
 * 
 * @title GameManager contract implementation
 * @author BGHProjects
 * @notice Manages all the contractual interactions within the game
 * 
 */

contract GameManager is IGameManager, Initializable {

    /**
     * =======================
     *   VARIABLES
     * =======================
     */

    // References to other contracts
    ERC20 public _metrContract;
    MBlox private MBloxContract;
    MetaBlox private MetaBloxContract;
    World private WorldContract;

    // Address that receives the MATIC payments
    address payable _recipient;

    // Holds all the used colours
    string[] usedColours;

    // Holds relevant information about the player
    mapping(address => PlayerInfo) private players;

    // Shorthand representation of the grid
    GridData[] private gridData;

    // Restricts calls to the game wallet
    address private _gameWallet;

    // Holds used signatures to prevent double dipping
    mapping(bytes => bool) private usedSignatures;

    /**
     * =======================
     *   INITIALIZE
     * =======================
     */

    function initialize(
        address gameWallet,
        address metrContract,
        address mbloxAddress,
        address metaBloxAddress,
        address worldAddress,
        address recipient
    ) public initializer {

        // Check for zero addresses
        if(metrContract == address(0)) revert ZeroAddress();
        if(mbloxAddress == address(0)) revert ZeroAddress();
        if(metaBloxAddress == address(0)) revert ZeroAddress();
        if(worldAddress == address(0)) revert ZeroAddress();
        if(recipient == address(0)) revert ZeroAddress();

        // Assign the contract references
        _metrContract = ERC20(metrContract);
        MBloxContract = MBlox(mbloxAddress);
        MetaBloxContract = MetaBlox(metaBloxAddress);
        WorldContract = World(worldAddress);

        // Assign the recipient
        _recipient = payable(recipient); 

        // Assign the gameWallet
        _gameWallet = gameWallet;
    }

    /**
     * =======================
     *   GETTERS
     * =======================
     */

    function getPlayerMETRBalance(
        address player
    ) public view returns (uint256) {
        return players[player].claimedMETRBalance;
    }

    function getUsedColours() public view returns (string[] memory) {
        return usedColours;
    }

    function getPlayerColour(
        address player
    ) public view returns (string memory) {
        return players[player].colour;
    }

    function getPrice(uint256 blockID) private view returns(uint256 price)
    {
        uint256 blockPrice = MetaBloxContract.prices(blockID);
        if(blockPrice == 0) revert InvalidTokenID();
        return blockPrice;
    }

    function getGridData() public view returns(GridData[] memory)
    {
        return gridData;
    }

    /**
     * =======================
     *   PURCHASE BLOCKS
     * =======================
     */
    function purchaseBlocks(
        uint256 id,
        uint256 amount,
        address purchaser,
        string memory dateTime,
        bytes memory signature
    ) public {
        if(purchaser == address(0)) revert ZeroAddress();
        if (amount < 1) revert NotPositiveValue();

        bytes memory args = abi.encode(id, amount, purchaser, bytes(dateTime));
        _verifySignature(signature, args);
        
        uint256 blockPrice = getPrice(id);
        uint256 purchaseCost = blockPrice * amount;
        if(purchaseCost > MBloxContract.balanceOf(purchaser)) revert InadequateMBLOX();

        MBloxContract.burnMBlox(purchaser, purchaseCost);
        MetaBloxContract.mintMetaBlox(purchaser, id, amount);

        emit BlocksPurchased(purchaser, id, amount);
    }

    /**
     * =======================
     *   PURCHASE WORLD
     * =======================
     */
    function purchaseWorld(
        WorldMetadata calldata worldData,
        address purchaser,
        string memory dateTime,
        bytes memory signature
    ) external override {
        if(purchaser == address(0)) revert ZeroAddress();
        if(MBloxContract.balanceOf(purchaser) < 100 ether) revert InadequateMBLOX();

        bytes memory args = abi.encode(worldData, purchaser, bytes(dateTime));
        _verifySignature(signature, args);

        MBloxContract.burnMBlox(purchaser, 100 ether);
        WorldContract.mintWorld(purchaser, worldData);
        players[purchaser].colour = worldData.colour;
        usedColours.push(worldData.colour);
        uint256 currentId = WorldContract._tokenIdCounter();
        GridData memory newGridData = GridData(currentId, worldData.colour, worldData.worldGridData.coords.x, worldData.worldGridData.coords.y);
        gridData.push(newGridData);
        emit WorldPurchased(purchaser, worldData.worldGridData.coords.x, worldData.worldGridData.coords.y);
    }

    /**
     * =======================
     *   SAVE WORLD CHANGES
     * =======================
     */

    function saveWorldChanges(
        address player,
        uint256 worldID,
        WorldBlockDetails memory worldBlockDetails,
        BlockUpdates memory blockUpdates,
        string memory dateTime,
        bytes memory signature
    ) public {
        bytes memory args = abi.encode(player, worldID, worldBlockDetails, blockUpdates, bytes(dateTime));
        _verifySignature(signature, args);

        WorldContract.updateWorld(worldID, worldBlockDetails);

        if(blockUpdates.increases.length > 0)
        {
            MetaBloxContract.batchMintMetaBlox(player, blockUpdates.increaseIds, blockUpdates.increases);
        }

        if(blockUpdates.decreases.length > 0)
        {
            MetaBloxContract.batchBurnMetaBlox(player, blockUpdates.decreaseIds, blockUpdates.decreases);
        }
    }

    /**
     * =========================
     *   CONVERT MATIC TO MBLOX
     * =========================
     */
    function convertMATICtoMBLOX(address receiver, string memory dateTime, bytes memory signature) payable public {
        if(receiver == address(0)) revert ZeroAddress();
        if(msg.value < 0.1 ether) revert InadequateMATIC();

        bytes memory args = abi.encode(receiver, bytes(dateTime));

        _verifySignature(signature, args);

        MBloxContract.mintMBlox(receiver, 1000 ether);
        _recipient.transfer(msg.value);
        emit MBLOXPurchased(receiver, 1000 ether);
        emit PaymentDistributed(msg.value);
    }

    /**
     * =======================
     *   CLAIM METR BALANCE
     * =======================
     */
    function claimMETRBalance(address claimant, string memory dateTime, bytes memory signature) external override {
        if(claimant == address(0)) revert ZeroAddress();
        uint256 previousClaim = players[claimant].claimedMETRBalance;
        uint256 METRBalance = _metrContract.balanceOf(claimant);
        if(previousClaim >= METRBalance) revert NoMETRToClaim();

        bytes memory args = abi.encode(claimant, bytes(dateTime));
        _verifySignature(signature, args);

        players[claimant].claimedMETRBalance = METRBalance;
        MBloxContract.mintMBlox(claimant, METRBalance - previousClaim);
        emit METRBalanceClaimed(claimant, METRBalance - previousClaim);
    }

    /**
     * =======================
     *  VERIFY SIGNATURE 
     * =======================
     */
    function _verifySignature(bytes memory signature, bytes memory message) internal {

        if(usedSignatures[signature]) revert InvalidSignature();

        address recoveredAddress = SigRecovery.recoverAddressFromMessage(
            message,
            signature
        );

        if(recoveredAddress != _gameWallet) revert InvalidSignature();

        usedSignatures[signature] = true;
    }

}
