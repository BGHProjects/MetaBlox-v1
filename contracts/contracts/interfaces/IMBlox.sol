// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface IMBlox {

    ///////////////
    // EVENTS
    ///////////////

    /// @dev Emitted when MBlox has been minted
    /// @param amount The amount of MBlox that has been minted
    /// @param to The address to which the MBlox has been minted
    event MBloxMinted(
        uint256 indexed amount,
        address to
    );

    /// @dev Emitted when MBlox has been burned
    /// @param amount The amount of MBlox that has been minted 
    event MBloxBurned(
        uint256 indexed amount,
        address from
    );

    ///////////////
    // FUNCTIONS
    ///////////////

    /// @dev Initializing function required for upgradeable smart contracts
    /// @param digitalKey Variable used to authenticate this contract's function calls
    function initialize(string memory digitalKey) external;

    /// @dev Mints MBlox token to an address
    /// @param to The address to which the MBlox will be minted
    /// @param amount The amount of MBlox that will be minted
    /// @param digitalKey Variable used to authorise this function call
    function mintMBlox(address to, uint256 amount, string memory digitalKey) external;

    /// @dev Burns MBlox token from an address
    /// @param from The address from which the MBlox will be burned
    /// @param amount The amount of MBlox that will be burned
    /// @param digitalKey Variable used to authorise this function call
    function burnMBlox(address from, uint256 amount, string memory digitalKey) external;

    /// @dev Grants the relevant roles to another account
    /// @param account The account to be granted the roles
    /// @param digitalKey Variable used to authorise this function call
    function grantRoles(address account, string memory digitalKey) external;
    
    ///////////////
    // ERRORS
    ///////////////

    /// @dev The Zero Address has been used as a variable
    error ZeroAddress();

    /// @dev Amount supplied isn't a positive number
    error NotPositiveValue();

    /// @dev The digital key supplied is invalid
    error InvalidDigitalKey();
}