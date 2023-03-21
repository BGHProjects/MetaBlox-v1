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
 * @title Utilities contract interface
 * @author BGHProjects
 * @notice Describes the external functions and other utilities shared across multiple contracts
 * 
 */

interface IUtilities {
    
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
   /// @param blockTotal The total number of blocks of each variant
   /// @param worldLayout A stringified version of the layout of the world
   struct WorldBlockDetails {
    uint256 blockTotal;
    string worldLayout;
   }

   /// @dev Structure of the incoming data when minting a new World
   /// @param worldGridData The coordinates and owner of the World
   /// @param worldBlockDetails The total number of blocks and their layout in the world
   /// @param colour The colour associated with the address that will own the new World
   /// @param id The token ID for the newly minted World
   struct WorldMetadata {
    WorldGridData worldGridData;
    WorldBlockDetails worldBlockDetails;
    string colour;
    uint256 id;
    string tokenURI;
   }

   /**
    * =======================
    *   ERRORS
    * =======================
    */

   /// @dev The Zero Address has been used as a variable
    error ZeroAddress();

    /// @dev The digital key supplied in invalid
    error InvalidDigitalKey();

    /// @dev An inputted ID does not match any existing records it is associated with
    error InvalidTokenID();

    /// @dev Amount supplied isn't a positive number
    error NotPositiveValue();

    /// @dev Signature provided is not valid
    error InvalidSignature();
}
