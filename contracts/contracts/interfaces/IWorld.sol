// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./IUtilities.sol";
import "./IGameToken.sol";
import "./IGameItem.sol";

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

interface IWorld is  IGameItem, IGameToken, IUtilities {

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
    /// @param id The World's token ID
   event WorldUpdated(uint256 id);

    /// @dev Emmitted when a World has been burned
    /// @param id The World's token ID
   event WorldBurned(uint256 id);

   /**
    * =======================
    *   FUNCTIONS
    * =======================
    */

    /// @dev Creates a new World within the game
    /// @param to The address that will be receiving the new World
    /// @param worldData The data of the new World
    function mintWorld(address to, WorldMetadata calldata worldData) external;

    /// @dev Updates the block details of an existing World
    /// @param tokenId The ID of the World to be updated
    /// @param worldBlockDetails The details regarding the blocks used and their layout
    function updateWorld(uint256 tokenId, WorldBlockDetails calldata worldBlockDetails) external;

    /// @dev Retrieves the URI for a specific token
    /// @param tokenId The ID of the World token whose URI the user is trying to retrieve
    function tokenURI(uint256 tokenId) external returns(string memory);

    /// @dev Burns a World token
    /// @param tokenId The ID of the World token to be burned
    function burnWorld(uint256 tokenId) external;

   /**
    * =======================
    *   ERRORS
    * =======================
    */

    /// @dev World is attempting to be minted on a grid location that is already occupied
    error AlreadyOnGrid();
}