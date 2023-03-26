// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IMetaBlox.sol";
import "../interfaces/IGameItem.sol";
import "./libraries/SigRecovery.sol";
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
 * @title MetaBlox contract implementation
 * @author BGHProjects
 * @notice Handles all the functionality pertaining to the MetaBlox in-game item, which represent the blocks used to build within the game
 * 
 */

contract MetaBlox is Initializable, ERC1155Upgradeable, AccessControlUpgradeable, ERC1155BurnableUpgradeable, IMetaBlox {

    /**
    * =======================
    *   VARIABLES
    * =======================
    */

    // Roles used within the contract
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Stores the prices of the different blocks in ether
    mapping(uint256 => uint256) public prices; 

    // IDs for all the block variants
    uint256 private constant DIRT = 0;
    uint256 private constant GRASS = 1;
    uint256 private constant LOG = 2;
    uint256 private constant WOOD = 3;
    uint256 private constant GLASS = 4;
    uint256 private constant LAVA = 5;
    uint256 private constant GOLD = 6;
    uint256 private constant OPAL = 7;
    uint256 private constant AMETHYST = 8;
    uint256 private constant SPACE = 9;

    // Restricts calls to the game wallet
    address private _gameWallet;

    // Holds used signatures to prevent double dipping
    mapping(bytes => bool) private usedSignatures;

     /**
     * =======================
     *  INITIALIZE
     * =======================
     */
    function initialize(address gameWallet) initializer public {

        // Assign the gameWallet
        _gameWallet = gameWallet;

        // Assign the prices for the blocks
        prices[0] = 10 ether;
        prices[1] = 10 ether;
        prices[2] = 10 ether;
        prices[3] = 10 ether;
        prices[4] = 15 ether;
        prices[5] = 15 ether;
        prices[6] = 15 ether;
        prices[7] = 15 ether;
        prices[8] = 15 ether;
        prices[9] = 20 ether;

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

    /**
     * =======================
     *  MINT METABLOX
     * =======================
     */
    function mintMetaBlox(address account, uint256 id, uint256 amount) public onlyRole(MINTER_ROLE)
    {
        if(account == address(0)) revert ZeroAddress();
        if(prices[id] == 0) revert InvalidTokenID();
        if(amount < 1) revert NotPositiveValue();
        _mint(account, id, amount, "");

        uint256[] memory ids = new uint256[](1);
        ids[0] = id;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        emit MetaBloxMinted(ids, amounts, account);
    }

    /**
     * =======================
     *  BURN METABLOX
     * =======================
     */
    function burnMetaBlox(address account, uint256 id, uint256 amount) public onlyRole(BURNER_ROLE)
    {
        if(account == address(0)) revert ZeroAddress();
        if(prices[id] == 0) revert InvalidTokenID();
        if(amount < 1) revert NotPositiveValue();
        _burn(account, id, amount);

        uint256[] memory ids = new uint256[](1);
        ids[0] = id;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        emit MetaBloxBurned(ids, amounts, account);
    }

    /**
     * =======================
     *  BATCH MINT METABLOX
     * =======================
     */
    function batchMintMetaBlox(address account, uint256[] calldata ids, uint256[] calldata amounts) public onlyRole(MINTER_ROLE)
    {
        if(account == address(0)) revert ZeroAddress();
        for (uint256 i = 0; i < ids.length; i++)
        {
            if(prices[ids[i]] == 0) revert InvalidTokenID();
        }

        for (uint256 i = 0; i < amounts.length; i++)
        {
            if(amounts[i] < 1) revert NotPositiveValue();
        }

        _mintBatch(account, ids, amounts, "");
        emit MetaBloxMinted(ids, amounts, account);
    }

    /**
     * =======================
     *  BATCH BURN METABLOX
     * =======================
     */
    function batchBurnMetaBlox(address account, uint256[] calldata ids, uint256[] calldata amounts) public onlyRole(MINTER_ROLE)
    {
        if(account == address(0)) revert ZeroAddress();
        for (uint256 i = 0; i < ids.length; i++)
        {
            if(prices[ids[i]] == 0) revert InvalidTokenID();
        }

        for (uint256 i = 0; i < amounts.length; i++)
        {
            if(amounts[i] < 1) revert NotPositiveValue();
        }

        _burnBatch(account, ids, amounts);
        emit MetaBloxBurned(ids, amounts, account);
    }

    /**
     * =======================
     *  GRANT ROLES
     * =======================
     */
    function grantRoles(address account, bytes memory signature) public {
        if (account == address(0)) revert ZeroAddress();
        _verifySignature(account, signature);
        _setupRole(MINTER_ROLE, account);
        _setupRole(BURNER_ROLE, account);
        _setupRole(URI_SETTER_ROLE, account);
    }

    /**
     * =======================
     *  METABLOX PRICE
     * =======================
     */
    function metaBloxPrice(uint256 id) public view returns (uint256 price)
    {
        if(prices[id] == 0) revert InvalidTokenID();
        return prices[id];
    }

    /**
     * =======================
     *  CONTRACT URI
     * =======================
     */
    function contractURI() public pure returns (string memory)
    {
       return "ipfs://QmQ5QgpmPgrdeMEDkX12cmhTjsqHPX98K9dKPggFd3tZKT";
    }

    /**
     * =======================
     *  SET URI
     * =======================
     */
    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }
    
    /**
     * =======================
     *  SUPPORTS INTERFACE
     * =======================
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlUpgradeable, ERC1155Upgradeable, IGameItem)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * =======================
     *  VERIFY SIGNATURE
     * =======================
     */
    function _verifySignature(address account, bytes memory signature) internal {

        if(usedSignatures[signature]) revert InvalidSignature();

        bytes memory encodedRequest = abi.encode(account);

        address recoveredAddress = SigRecovery.recoverAddressFromMessage(
            encodedRequest,
            signature
        );

        if(recoveredAddress != _gameWallet) revert InvalidSignature();

        usedSignatures[signature] = true;
    }

}
