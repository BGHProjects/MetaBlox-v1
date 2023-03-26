// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IWorld.sol";
import "../interfaces/IGameItem.sol";
import "./libraries/SigRecovery.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * 
 * ███╗   ███╗███████╗████████╗ █████╗ ██████╗ ██╗      ██████╗ ██╗  ██╗
 * ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔═══██╗╚██╗██╔╝
 * ██╔████╔██║█████╗     ██║   ███████║██████╔╝██║     ██║   ██║ ╚███╔╝ 
 * ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══██╗██║     ██║   ██║ ██╔██╗ 
 * ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██████╔╝███████╗╚██████╔╝██╔╝ ██╗
 * ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
 * 
 * @title World contract implementation
 * @author BGHProjects
 * @notice Handles all the functionality pertaining to the World token, which represents the world that the players build inside of
 * 
 */

contract World is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    AccessControlUpgradeable,
    IWorld
{
    /**
     * =======================
     *   ASSOCIATIONS
     * =======================
     */

    using Strings for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    /**
     * =======================
     *   VARIABLES
     * =======================
     */

    // Roles used within the contract
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // Holds World data to be accessed by the game
    mapping(uint256 => WorldMetadata) public worlds;

    // Tracks token IDs
    CountersUpgradeable.Counter public _tokenIdCounter;

    // Restricts calls to the game wallet
    address private _gameWallet;

    // Holds used signatures to prevent double dipping
    mapping(bytes => bool) private usedSignatures;
    
    /**
     * =======================
     *  INITIALIZE
     * =======================
     */
    function initialize(address gameWallet) public initializer {

        // Assign the gameWallet
        _gameWallet = gameWallet;

        // Upgradeable contract required initializations
        __ERC721_init("WorldToken", "WRLD");
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __AccessControl_init();

        // Assign the roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    /**
     * =======================
     *  MINT WORLD
     * =======================
     */
    function mintWorld(address to, WorldMetadata memory worldData) public onlyRole(MINTER_ROLE){
        if(to == address(0)) revert ZeroAddress();
        if(worldData.worldGridData.owner == address(0)) revert ZeroAddress();

        uint256 totalWorlds = _tokenIdCounter.current() + 1;
        Coordinates memory coords = worldData.worldGridData.coords;

            for (uint256 i = 0; i < totalWorlds; i++)
            {
                if(worlds[i].worldGridData.coords.x == coords.x && worlds[i].worldGridData.coords.y == coords.y) revert AlreadyOnGrid();   
            }

        uint256 tokenId = _tokenIdCounter.current();
        worldData.id = tokenId;
        worlds[tokenId] = worldData; // Sets worlds entry so it can be used by generateMetadata;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, worldData.tokenURI);

        _tokenIdCounter.increment();
        emit WorldMinted(to, worldData.worldGridData.coords.x, worldData.worldGridData.coords.y, tokenId);
    }

    /**
     * =======================
     *  UPDATE WORLD
     * =======================
     */
    function updateWorld(
        uint256 tokenId,
        WorldBlockDetails memory worldBlockDetails
    ) public onlyRole(UPDATER_ROLE) {
        if(!_exists(tokenId)) revert InvalidTokenID();
        worlds[tokenId].worldBlockDetails = worldBlockDetails;
        emit WorldUpdated(tokenId);
    }

    /**
     * =======================
     *  TOKEN URI
     * =======================
     */
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721URIStorageUpgradeable, ERC721Upgradeable, IWorld)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
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
        _setupRole(UPDATER_ROLE, account);
    }

    /**
     * =======================
     *  CONTRACT URI
     * =======================
     */
    function contractURI() public pure returns (string memory) {
        return "ipfs://QmY1nfK2yNWiPzC22xrXekzgmn2rp3pzpxqN9B7nxrdjx9";
    }

    /**
     * =======================
     *  BURN WORLD
     * =======================
     */
    function burnWorld(uint256 tokenId) public onlyRole(BURNER_ROLE) {
        _burn(tokenId);
    }

    /**
     * =======================
     *  INTERNAL BURN OVERRIDE
     * =======================
     */
    function _burn(uint256 tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
        delete worlds[tokenId];
        _tokenIdCounter.decrement();
        emit WorldBurned(tokenId);
    }

    /**
     * =======================
     *  SUPPORTS INTERFACE
     * =======================
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(AccessControlUpgradeable, ERC721Upgradeable, IGameItem)
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