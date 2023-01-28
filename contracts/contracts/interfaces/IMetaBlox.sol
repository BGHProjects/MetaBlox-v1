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
 * @title MetaBlox contract interface
 * @author BGHProjects
 * @notice Describes the external functions and other utilities used by the MetaBlox contract
 * 
 */

interface IMetaBlox is IGameItem, IGameToken, IUtilities {

    /**
    * =======================
    *   EVENTS
    * =======================
    */

    /// @dev Emitted when MetaBlox are minted
    /// @param ids The ids for the types of MetaBlox that are minted
    /// @param amounts The amounts of MetaBlox that have been minted for the given type
    /// @param to The address to which the MetaBlox has been minted
    event MetaBloxMinted(uint256[] ids, uint256[] amounts, address to);

    /// @dev Emitted when MetaBlox are burned
    /// @param ids The ids for the types of MetaBlox that are burned
    /// @param amounts The amounts of MetaBlox that have been burned for the given type
    /// @param from The address from which the MetaBlox have been burned
    event MetaBloxBurned(uint256[] ids, uint256[] amounts, address from);

    /**
    * =======================
    *   FUNCTIONS
    * =======================
    */

    /// @dev Mints one type of MetaBlox token to an inputted user
    /// @param account The account that is receiving the MetaBlox
    /// @param id The type of MetaBlox that the account is receiving
    /// @param amount The amount of MetaBlox that the account is receiving
    function mintMetaBlox(address account, uint256 id, uint256 amount) external;

    /// @dev Burns one type of MetaBlox token from an inputted user
    /// @param account The account that is having their MetaBlox burned
    /// @param id The type of MetaBlox that is being burned
    /// @param amount The amount of MetaBlox that is being burned
    function burnMetaBlox(address account, uint256 id, uint256 amount) external;

    /// @dev Mints multiple types of MetaBlox tokens to an inputted user
    /// @param account The account that is receiving the MetaBlox
    /// @param ids The types of MetaBlox that the account is receiving
    /// @param amounts The amounts of MetaBlox that the account is receiving
    function batchMintMetaBlox(address account, uint256[] calldata ids, uint256[] calldata amounts) external;

    /// @dev Burns multiple types of MetaBlox tokens from an inputted user
    /// @param account The account that is having their MetaBlox burned
    /// @param ids The types of MetaBlox that are being burned
    /// @param amounts The amounts of MetaBlox that are being burned
    function batchBurnMetaBlox(address account, uint256[] calldata ids, uint256[] calldata amounts) external;

    /// @dev Sets the URI for the contract to the inputted value
    /// @param newURI The new URI to be set to the contract
    function setURI(string memory newURI) external;

    /// @dev Returns the price of a MetaBlox from a given id
    /// @param id The id for the MetaBlox the caller wishes to get the price of
    function metaBloxPrice(uint256 id) external returns (uint256);
}