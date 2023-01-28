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
 * @title GameItem contract interface
 * @author BGHProjects
 * @notice Describes the external functions and other utilities shared across multiple Game Item contracts
 * 
 */

interface IGameItem {
    
    /**
    * =======================
    *   FUNCTIONS
    * =======================
    */

    /// @dev Function required by Solidity to confirm the interface used by this contract
    /// @param interfaceId The id for the interface to be checked against this contract
    function supportsInterface(bytes4 interfaceId) external returns(bool);

    /// @dev Function required by OpenSea in order to view the URI of the contract's collection
    function contractURI() external returns(string memory);
}