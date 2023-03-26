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
 * @title GameToken contract interface
 * @author BGHProjects
 * @notice Describes the external functions and other utilities shared across multiple Game Token contracts
 * 
 */

interface IGameToken {
    
    /**
    * =======================
    *   FUNCTIONS
    * =======================
    */

    /// @dev Intializing function required for upgradeable smart contracts
    /// @param gameWallet Wallet that is authorised to call certain contract calls
    function initialize(address gameWallet) external;

    /// @dev Grants the relevant roles to another account
    /// @param account The account to be granted the roles
    /// @param signature The signature signed by the game wallet used to authorise this call
    function grantRoles(address account, bytes memory signature) external;
}