// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/**
 * 
 * ███╗   ███╗███████╗████████╗ █████╗ ██████╗ ██╗      ██████╗ ██╗  ██╗
 * ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔═══██╗╚██╗██╔╝
 * ██╔████╔██║█████╗     ██║   ███████║██████╔╝██║     ██║   ██║ ╚███╔╝ 
 * ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══██╗██║     ██║   ██║ ██╔██╗ 
 * ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██████╔╝███████╗╚██████╔╝██╔╝ ██╗
 * ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
 * 
 * @title World contract interface
 * @author BGHProjects
 * @notice Describes the external functions and other utilities used by the World contract
 * 
 */

interface IWorld {

    /**
    * =======================
    *   STRUCTS
    * =======================
    */

   /// @dev Structure to house the coordinates of a World
   /// @param x The x-coordinate of the World within the grid
   /// @param y The y-coordinate of the World within the grid
   struct Coordinates {
    uint256 x;
    uint256 y;
   }

    /// @dev Structure to house the grid data of a World
    /// @param owner The owner of the World
    /// @param coords The coordinates of the World in the grid
   struct WorldGridData {
    address owner;
    Coordinates coords;
   }

   /// @dev Structure of the information regarding the blocks in a World
   /// @param blockTotals The total number of blocks of each variant
   /// @param worldLayout A stringified version of the layout of the world
   struct WorldBlockDetails {
    uint256[] blockTotals;
    string worldLayout;
   }

   /// @dev Structure of the incoming data when minting a new World
   /// @param worldGridData The coordinates and owner of the World
   /// @param worldBlockDetails The total number of blocks and their layout in the world
   struct WorldMetadata {
    WorldGridData worldGridData;
    WorldBlockDetails worldBlockDetails;
   }

    /**
    * =======================
    *   EVENTS
    * =======================
    */

    /// @dev Emitted when a new World is minted
    /// @param to The address to whom the World was minted
    /// @param x The x-coordinate of the newly minted World
    /// @param y The y-coordinate of the newly minted World
    /// @param id The World's token ID
    event WorldMinted(address to, uint256 x, uint256 y, uint256 id);

    /// @dev Emmitted when a World has been updated
    /// @param owner The owner of the World that has been updated
    /// @param id The World's token ID
   event WorldUpdated(address owner, uint256 id);

   /**
    * =======================
    *   FUNCTIONS
    * =======================
    */

    /// @dev Intializing function required for upgradeable smart contracta
    /// @param digitalKey Variable used to authenticate this contract's function calls
    function initialize(string memory digitalKey) external;

    /// @dev Creates a new World within the game
    /// @param worldData The data of the new World
    function mintWorld(WorldMetadata calldata worldData) external;

    /// @dev Updates the block details of an existing World
    /// @param tokenId The ID of the World to be updated
    /// @param worldBlockDetails The details regarding the blocks used and their layout
    function updateWorld(uint256 tokenId, WorldBlockDetails calldata worldBlockDetails) external;

    /// @dev Retrieves the URI for a specific token
    /// @param tokenId The ID of the World token whose URI the user is trying to retrieve
    function tokenURI(uint256 tokenId) external returns(string memory);

    /// @dev Grants the relevant roles to another account
    /// @param account The account to be granted the roles
    /// @param digitalKey Variable used to authorise this function call
    function grantRoles(address account, string memory digitalKey) external;

    /// @dev Function required by Solidity to confirm the interface used by this contract
    /// @param interfaceId The id for the interface to be checked against this contract
    function supportsInterface(bytes4 interfaceId) external returns (bool);

    /// @dev Function required by OpenSea in order to view the URI of the contract's collection
    function contractURI() external returns (string memory);

   /**
    * =======================
    *   ERRORS
    * =======================
    */

    /// @dev The Zero Address has been used as a variable
    error ZeroAddress();

    /// @dev The digital key supplied in invalid
    error InvalidDigitalKey();

    /// @dev World is attempting to be minted on a grid location that is already occupied
    error AlreadyOnGrid();
}