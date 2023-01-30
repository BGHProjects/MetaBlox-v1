// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./IUtilities.sol";

/**
 * 
 * ███╗   ███╗███████╗████████╗ █████╗ ██████╗ ██╗      ██████╗ ██╗  ██╗
 * ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔═══██╗╚██╗██╔╝
 * ██╔████╔██║█████╗     ██║   ███████║██████╔╝██║     ██║   ██║ ╚███╔╝ 
 * ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══██╗██║     ██║   ██║ ██╔██╗ 
 * ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██████╔╝███████╗╚██████╔╝██╔╝ ██╗
 * ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
 * 
 * @title GameManager contract interface
 * @author BGHProjects
 * @notice Describes the external functions and other utilities used by the GameManager contract
 * 
 */

interface IGameManager is IUtilities{

    /**
    * =======================
    *   STRUCTS
    * =======================
    */

    /// @dev Houses the relevant information pertaining to a player
    /// @param colour The colour assigned to a player
    /// @param claimedMETRBalance The highest balance of METR Token that a player has claimed so far
    struct PlayerInfo {
        string colour;
        uint256 claimedMETRBalance;
    }

    /// @dev Structures the GameManager's shorthand representation of the grid
    /// @param id The ID of the token that represents the World on the grid
    /// @param colour The colour associated with the player who owns the World
    /// @param x The x-coordinate of the World on the grid
    /// @param y The y-coordinate of the World on the grid
    struct GridData {
        uint256 id;
        string colour;
        uint256 x;
        uint256 y;
    }

    /// @dev Variables used to update the user's MetaBlox balance based on their gameplay
    /// @param increaseIds The IDs of the blocks whose balances have been increased following gameplay
    /// @param increases The amount that each increased block has increased by following gameplay
    /// @param decreaseIds The IDs of the blocks whose balances have been decreased following gameplay
    /// @param decreases The amount that each decreased block has decreased by following gameplay
    struct BlockUpdates {
        uint256[] increaseIds;
        uint256[] increases;
        uint256[] decreaseIds;
        uint256[] decreases;
    }

   /**
    * =======================
    *   EVENTS
    * =======================
    */

    /// @dev Emitted when the MATIC used to purchase MBLOX has been distrubuted to the receiver address
    /// @param amount The amount of MATIC that has been distributed
    event PaymentDistributed(uint256 amount);

    /// @dev Emitted when a player's balance of a certain block type has been updated
    /// @param player The player whose balance is being updated
    /// @param id The type of block being updated
    /// @param prevAmount The previous amount of the block being updated
    /// @param newAmount The new amount of the block being updated
    event UpdatedBlockBalance(address player, uint256 id, uint256 prevAmount, uint256 newAmount);

    /// @dev Emitted when MetaBlox have been purchased
    /// @param to The address of the player who purchased the blocks
    /// @param id The ID of the block being purchased
    /// @param amount The amount of the block being purchased
    event BlocksPurchased(address to, uint256 id, uint256 amount);

    /// @dev Emitted when a World has been purchased
    /// @param to The address of the player who purchased the World
    /// @param x The x-coordinate of the World being purchased
    /// @param y The y-coordinate of the World being purchased
    event WorldPurchased(address to, uint256 x, uint256 y);

    /// @dev Emitted when a player has purchased MBLOX
    /// @param to The address who purchased the MBLOX
    /// @param amount The amount of MBLOX that has been purchased
    event MBLOXPurchased(address to, uint256 amount);

    /// @dev Emitted when a player has used their METR balance to claim MBLOX
    /// @param to The address of the player who has claimed their METR Balance
    /// @param amount The balance of METR that is being used to claim MBLOX
    event METRBalanceClaimed(address to, uint256 amount);

    /**
    * =======================
    *   FUNCTIONS
    * =======================
    */

    /// @dev Initializing function required for upgradeable smart contracts
    /// @param digitalKey Variable used to authenticated this contract's function calls
    /// @param metrContract Address of the METR contract
    /// @param mbloxAddress Address of the MBLOX contract
    /// @param metaBloxAddress Address of the MetaBlox contract
    /// @param worldAddress Address of the World contract
    /// @param recipient Address of the recipient of the MATIC transfers
    function initialize(string memory digitalKey, address metrContract, address mbloxAddress, address metaBloxAddress, address worldAddress, address recipient) external;

    /// @dev Returns all the currently used colours, so when generating another, there are no duplicates
    function getUsedColours() external returns(string[] memory);

    /// @dev Retrieves a player's colour
    /// @param player The player whose colour is being retrieved
    function getPlayerColour(address player) external returns(string memory);

    /// @dev Retrieve's the balance of METR that the player last claimed as MBLOX
    /// @param player The player whose balance is being retrieved
    function getPlayerMETRBalance(address player) external returns(uint256);

    /// @dev Returns a short hand version of the grid that contains all the World tokens
    function getGridData() external returns(GridData[] memory);

    /// @dev Saves the changes that a user has made in their world, and updates the relevant balances
    /// @param digitalKey Variable used to authenticate this function call
    /// @param player The account that called this function
    /// @param worldID The ID of the world that is having its changes saved
    /// @param worldBlockDetails The details about the World that have now been changed
    /// @param blockUpdates The increases and decreases that were made to the user's MetaBlox balances following gameplay
    function saveWorldChanges(string memory digitalKey, address player, uint256 worldID, WorldBlockDetails memory worldBlockDetails, BlockUpdates memory blockUpdates) external;

    /// @dev Completes the purchase of MetaBlox for an inputted address, including burning MBLOX and minting MetaBlox
    /// @param digitalKey Variable used to authenticate this function call
    /// @param id The ID of the block being purchased
    /// @param amount The amount of the block being purchased
    /// @param purchaser The address of the player who is purchasing the blocks
    function purchaseBlocks(string memory digitalKey, uint256 id, uint256 amount, address purchaser) external;

    /// @dev Completes the purchase of a World for an inputted address, including burning MBLOX and minting the World token
    /// @param digitalKey Variable used to authenticate this function call
    /// @param worldData The data about the new World being minted
    /// @param purchaser The address of the player who is purchasing the World
    function purchaseWorld(string memory digitalKey, WorldMetadata calldata worldData, address purchaser) external;

    /// @dev Converts inputted MATIC to MBLOX tokens
    /// @param digitalKey Variable used to authenticate this function call
    /// @param receiver The recipient of the MBLOX tokens
    function convertMATICtoMBLOX(string memory digitalKey,address receiver) payable external;

    /// @dev Mints MBLOX for an inputted user equivalent to the difference between their current METR Balance and the last time they claimed
    /// @param digitalKey Variable used to authenticate this function call
    /// @param claimant The user who is attempting to claim MBLOX from their METR Balance
    function claimMETRBalance(string memory digitalKey,address claimant) external;

   /**
    * =======================
    *   ERRORS
    * =======================
    */
   
   /// @dev Emits when the address within the context of the function does not have enough MBLOX to perform the action
   error InadequateMBLOX();

   /// @dev Emits when there is an inadequate amount of MATIC attached to a function within the function's context
   error InadequateMATIC();

    /// @dev Emits when there is no difference between the amount the user used to claim before, and their current METR balance
   error NoMETRToClaim();

}