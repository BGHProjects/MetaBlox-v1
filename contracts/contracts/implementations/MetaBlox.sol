// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IMetaBlox.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
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
 * @title The blocks used to build within the game
 * @author BGHProjects
 * @notice Handles all the functionality pertaining to the MetaBlox in-game item
 * 
 */

contract MetaBlox is Initializable, ERC1155Upgradeable, AccessControlUpgradeable, ERC1155BurnableUpgradeable, IMetaBlox {

    // Roles used within the contract
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Restricts use to authorised callers
    string private _digitalKey; 

    // Stores the prices of the different blocks in ether
    mapping(uint256 => uint256) private prices; 

    // IDs for all the block variants
    uint256 private constant DIRT = 0;
    uint256 private constant GRASS = 1;
    uint256 private constant LOG = 2;
    uint256 private constant WOOD = 3;
    uint256 private constant GLASS = 4;
    uint256 private constant GOLD = 5;
    uint256 private constant OPAL = 6;
    uint256 private constant SPACEINVADERS = 7;
    uint256 private constant PACMAN = 8;

    function initialize(string memory digitalKey) initializer public {
        
        // Assign the digital key
        _digitalKey = digitalKey;

        // Assign the prices for the blocks
        prices[0] = 10;
        prices[1] = 10;
        prices[2] = 10;
        prices[3] = 10;
        prices[4] = 15;
        prices[5] = 15;
        prices[6] = 15;
        prices[7] = 20;
        prices[8] = 20;

        // Upgradeable contract required initializations
        __ERC1155_init("");
        __AccessControl_init();
        __ERC1155Burnable_init();

        // Assign the roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender); 
    }


    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlUpgradeable, ERC1155Upgradeable, IMetaBlox)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
