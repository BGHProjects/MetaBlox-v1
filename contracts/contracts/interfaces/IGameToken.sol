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

    /// @dev Intializing function required for upgradeable smart contracta
    /// @param digitalKey Variable used to authenticate this contract's function calls
    function initialize(string memory digitalKey) external;

    /// @dev Grants the relevant roles to another account
    /// @param account The account to be granted the roles
    /// @param digitalKey Variable used to authorise this function call
    function grantRoles(address account, string memory digitalKey) external;
}