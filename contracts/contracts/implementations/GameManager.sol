// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

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

    // Restricts use to authorised callers
    string private _digitalKey;

    // References to other contracts
    ERC20 public _metrContract;
    MBlox private MBloxContract;
    MetaBlox private MetaBloxContract;
    World private WorldContract;

    // Address that receives the MATIC payments
    address _recipient;

    // Holds all the used colours
    string[] usedColours;

    // Holds relevant information about the player
    mapping(address => PlayerInfo) private players;

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

    /**
     * =======================
     *   SAVE WORLD CHANGES
     * =======================
     */
    function saveWorldChanges(
        string memory digitalKey,
        uint256 worldID,
        uint256[] memory blockAmounts,
        WorldBlockDetails memory worldBlockDetails
    ) external override {}

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
    ) external override {}

    /**
     * =======================
     *   PURCHASE WORLD
     * =======================
     */
    function purchaseWorld(
        string memory digitalKey,
        WorldMetadata calldata worldData,
        address purchaser
    ) external override {}

    /**
     * =========================
     *   CONVERT MATIC TO MBLOX
     * =========================
     */
    function convertMATICtoMBLOX(address receiver) external override {}

    /**
     * =======================
     *   CLAIM METR BALANCE
     * =======================
     */
    function claimMETRBalance(address claimant) external override {}
}
