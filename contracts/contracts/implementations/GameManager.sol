// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IGameManager.sol";
import "./MBlox.sol";
import "./MetaBlox.sol";
import "./World.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

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

    // Restricts use to authorised callers
    string private _digitalKey;

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

    /**
     * =======================
     *   INITIALIZE
     * =======================
     */

    function initialize(
        string memory digitalKey,
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

        // Assign the digital key
        _digitalKey = digitalKey;

        // Assign the contract references
        _metrContract = ERC20(metrContract);
        MBloxContract = MBlox(mbloxAddress);
        MetaBloxContract = MetaBlox(metaBloxAddress);
        WorldContract = World(worldAddress);

        // Assign the recipient
        _recipient = payable(recipient); 
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
        string memory digitalKey,
        uint256 id,
        uint256 amount,
        address purchaser
    ) public {
        if(purchaser == address(0)) revert ZeroAddress();
        if (keccak256(bytes((digitalKey))) != keccak256(bytes((_digitalKey))))
            revert InvalidDigitalKey();
        if (amount < 1) revert NotPositiveValue();
        
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
        string memory digitalKey,
        WorldMetadata calldata worldData,
        address purchaser
    ) external override {
        if(purchaser == address(0)) revert ZeroAddress();
        if (keccak256(bytes((digitalKey))) != keccak256(bytes((_digitalKey))))
            revert InvalidDigitalKey();
        if(MBloxContract.balanceOf(purchaser) < 100) revert InadequateMBLOX();


        MBloxContract.burnMBlox(purchaser, 100);
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
        string memory digitalKey,
        address player,
        uint256 worldID,
        WorldBlockDetails memory worldBlockDetails,
        BlockUpdates memory blockUpdates
    ) public {
        if (keccak256(bytes((digitalKey))) != keccak256(bytes((_digitalKey))))
            revert InvalidDigitalKey();
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
    function convertMATICtoMBLOX(string memory digitalKey, address receiver) payable public {
        if (keccak256(bytes((digitalKey))) != keccak256(bytes((_digitalKey))))
            revert InvalidDigitalKey();
        if(receiver == address(0)) revert ZeroAddress();
        if(msg.value < 0.1 ether) revert InadequateMATIC();

        MBloxContract.mintMBlox(receiver, 1000);
        _recipient.transfer(msg.value);
        emit MBLOXPurchased(receiver, 100);
        emit PaymentDistributed(msg.value);
    }

    /**
     * =======================
     *   CLAIM METR BALANCE
     * =======================
     */
    function claimMETRBalance(string memory digitalKey, address claimant) external override {
        if (keccak256(bytes((digitalKey))) != keccak256(bytes((_digitalKey))))
            revert InvalidDigitalKey();
        if(claimant == address(0)) revert ZeroAddress();
        uint256 previousClaim = players[claimant].claimedMETRBalance;
        uint256 METRBalance = _metrContract.balanceOf(claimant);
        if(previousClaim >= METRBalance) revert NoMETRToClaim();

        players[claimant].claimedMETRBalance = METRBalance;
        MBloxContract.mintMBlox(claimant, METRBalance - previousClaim);
        emit METRBalanceClaimed(claimant, METRBalance - previousClaim);
    }
}
