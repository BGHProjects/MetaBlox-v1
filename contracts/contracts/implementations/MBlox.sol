// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IMBlox.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * 
 * ███╗   ███╗███████╗████████╗ █████╗ ██████╗ ██╗      ██████╗ ██╗  ██╗
 * ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔═══██╗╚██╗██╔╝
 * ██╔████╔██║█████╗     ██║   ███████║██████╔╝██║     ██║   ██║ ╚███╔╝ 
 * ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══██╗██║     ██║   ██║ ██╔██╗ 
 * ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██████╔╝███████╗╚██████╔╝██╔╝ ██╗
 * ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
 * 
 * @title MBlox contract implementation
 * @author BGHProjects
 * @notice Handles the minting and burning of MetaBlox's in-game currency, MBlox
 * 
 */

contract MBlox is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    AccessControlUpgradeable,
    IMBlox
{
    /**
     * =======================
     *   VARIABLES
     * =======================
     */

    // Roles used within the contract
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Restricts use to authorised callers
    string private _digitalKey;

    /**
     * =======================
     *  INITIALIZE
     * =======================
     */
    function initialize(string memory digitalKey) public initializer {
        // Assign the digitalKey
        _digitalKey = digitalKey;

        // Upgradeable contract required initializations
        __ERC20_init("MBlox", "MBLOX");
        __ERC20Burnable_init();
        __AccessControl_init();

        // Assign the roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    /**
     * =======================
     *  MINT MBLOX
     * =======================
     */
    function mintMBlox(
        address to,
        uint256 amount
    ) public onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount < 1) revert NotPositiveValue();

        _mint(to, amount);
        emit MBloxMinted(amount, to);
    }

    /**
     * =======================
     *  BURN MBLOX
     * =======================
     */
    function burnMBlox(
        address from,
        uint256 amount
    ) public onlyRole(BURNER_ROLE) {
        if (from == address(0)) revert ZeroAddress();
        if (amount < 1) revert NotPositiveValue();

        _burn(from, amount);
        emit MBloxBurned(amount, from);
    }

    /**
     * =======================
     *  GRANT ROLES
     * =======================
     */
    function grantRoles(address account, string memory digitalKey) public {
        if (account == address(0)) revert ZeroAddress();
        if (keccak256(bytes((digitalKey))) != keccak256(bytes((_digitalKey))))
            revert InvalidDigitalKey();

        _setupRole(MINTER_ROLE, account);
        _setupRole(BURNER_ROLE, account);
    }
}
