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
 * @title MetaBlox contract interface
 * @author BGHProjects
 * @notice Describes the external functions and other utilities used by the MetaBlox contract
 * 
 */

interface IMetaBlox {

    ///////////////
    // EVENTS
    ///////////////

    /// @dev Emitted when MetaBlox are minted
    /// @param ids The ids for the types of MetaBlox that are minted
    /// @param amounts The amounts of MetaBlox that have been minted for the given type
    /// @param to The address to which the MetaBlox has been minted
    event MetaBloxMinted(uint256[] indexed ids, uint256[] indexed amounts, address to);

    /// @dev Emitted when MetaBlox are burned
    /// @param ids The ids for the types of MetaBlox that are burned
    /// @param amounts The amounts of MetaBlox that have been burned for the given type
    /// @param from The address from which the MetaBlox have been burned
    event MetaBloxBurned(uint256[] indexed ids, uint256[] indexed amounts, address from);

    ///////////////
    // FUNCTIONS
    ///////////////

    /// @dev Intializing function required for upgradeable smart contracta
    /// @param digitalKey Variable used to authenticate this contract's function calls
    function initialize(string memory digitalKey) external;

    /// @dev Mints one type of MetaBlox token to an inputted user
    /// @param account The account that is receiving the MetaBlox
    /// @param id The type of MetaBlox that the account is receiving
    /// @param amount The amount of MetaBlox that the account is receiving
    /// @param digitalKey Variable used to authorise this function call
    function mintMetaBlox(address account, uint256 id, uint256 amount, string memory digitalKey) external;

    /// @dev Burns one type of MetaBlox token from an inputted user
    /// @param account The account that is having their MetaBlox burned
    /// @param id The type of MetaBlox that is being burned
    /// @param amount The amount of MetaBlox that is being burned
    /// @param digitalKey Variable used to authorise this function call
    function burnMetaBlox(address account, uint256 id, uint256 amount, string memory digitalKey) external;

    /// @dev Mints multiple types of MetaBlox tokens to an inputted user
    /// @param account The account that is receiving the MetaBlox
    /// @param ids The types of MetaBlox that the account is receiving
    /// @param amounts The amounts of MetaBlox that the account is receiving
    /// @param digitalKey Variable used to authorise this function call
    function batchMintMetaBlox(address account, uint256[] calldata ids, uint256[] calldata amounts, string memory digitalKey) external;

    /// @dev Burns multiple types of MetaBlox tokens from an inputted user
    /// @param account The account that is having their MetaBlox burned
    /// @param ids The types of MetaBlox that are being burned
    /// @param amounts The amounts of MetaBlox that are being burned
    /// @param digitalKey Variable used to authorise this function call
    function batchBurnMetaBlox(address account, uint256[] calldata ids, uint256[] calldata amounts, string memory digitalKey) external;

    /// @dev Grants the relevant roles to another account
    /// @param account The account to be granted the roles
    /// @param digitalKey Variable used to authorise this function call
    function grantRoles(address account, string memory digitalKey) external;

    /// @dev Sets the URI for the contract to the inputted value
    /// @param newURI The new URI to be set to the contract
    function setURI(string memory newURI) external;

    /// @dev Function required by Solidity to confirm the interface used by this contract
    /// @param interfaceId The id for the interface to be checked against this contract
    function supportsInterface(bytes4 interfaceId) external returns (bool);

    /// @dev Function required by OpenSea in order to view the URI of the contract's collection
    function contractURI() external;

    /// @dev Returns the price of a MetaBlox from a given id
    /// @param id The id for the MetaBlox the caller wishes to get the price of
    function metaBloxPrice(uint256 id) external;

    ///////////////
    // ERRORS
    ///////////////

    /// @dev The Zero Address has been used as a variable
    error ZeroAddress();

    /// @dev Amount supplied isn't a positive number
    error NotPositiveValue();

    /// @dev The digital key supplied in invalid
    error InvalidDigitalKey();

    /// @dev The token for the supplied ID doesn't exist on the contract
    error InvalidTokenID();
}