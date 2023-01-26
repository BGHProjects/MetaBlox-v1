// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IWorld.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/**
 * 
 * ███╗   ███╗███████╗████████╗ █████╗ ██████╗ ██╗      ██████╗ ██╗  ██╗
 * ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔═══██╗╚██╗██╔╝
 * ██╔████╔██║█████╗     ██║   ███████║██████╔╝██║     ██║   ██║ ╚███╔╝ 
 * ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══██╗██║     ██║   ██║ ██╔██╗ 
 * ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██████╔╝███████╗╚██████╔╝██╔╝ ██╗
 * ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
 * 
 * @title The token that represents the world that the player's build inside of
 * @author BGHProjects
 * @notice Handles all the functionality pertaining to the World token
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
     *   VARIABLES
     * =======================
     */

    // Roles used within the contract
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // Restricts use to authorised callers
    string private _digitalKey;

    // Holds World data to be accessed by the game
    mapping(uint256 => WorldMetadata) public worlds;

    /**
     * =======================
     *  INITIALIZE
     * =======================
     */
    function initialize(string memory digitalKey) public initializer {
        // Assign the digital key
        _digitalKey = digitalKey;

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
     *  GENERATE METADATA
     * =======================
     */
    function generateMetadata(uint256 tokenId) private returns(string memory)
    {
        // Generates metadata for a World token from scratch
        // Finds the data about the World from the worlds mapping
    }

    /**
     * =======================
     *  UPDATE METADATA
     * =======================
     */
    function updateMetadata(uint256 tokenId, WorldBlockDetails calldata worldBlockDetails) private returns(string memory)
    {
        // Updates a token's metadata with the inputted details
    }

    /**
     * =======================
     *  MINT WORLD
     * =======================
     */
    function mintWorld(address to, WorldMetadata calldata worldData) public onlyRole(MINTER_ROLE){
        // Check if the to address is the zero address
        // Check if the world at inputted grid positions already exists
        // Set the tokenId counter
        // Add the World to the worlds mapping
        // Generate metadata
        // safeMint the world
        // set the tokenURI for the newly minted world
        // increment the tokenId counter
        // Emit event
    }

    /**
     * =======================
     *  UPDATE WORLD
     * =======================
     */
    function updateWorld(
        uint256 tokenId,
        WorldBlockDetails calldata worldBlockDetails
    ) public onlyRole(UPDATER_ROLE) {
        // Check if the tokenId matches a World that already exists
        // Generate new metadata based on the input
        // Set the tokenURI for the updated world
        // Update the World's entry in the worlds mapping
        // Emit event
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
    function grantRoles(address account, string memory digitalKey) public {
        if (account == address(0)) revert ZeroAddress();
        if (keccak256(bytes((digitalKey))) != keccak256(bytes((_digitalKey))))
            revert InvalidDigitalKey();

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
        return "https://contracturi";
    }

    /**
     * =======================
     *  BURN WORLD
     * =======================
     */
    function burnWorld(uint256 tokenId) public onlyRole(BURNER_ROLE) {
        delete worlds[tokenId];
        _burn(tokenId);
    }

    /**
     * =======================
     *  INTERNAL BURN OVERRIDE
     * =======================
     */
    function _burn(uint256 tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
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
        override(AccessControlUpgradeable, ERC721Upgradeable, IWorld)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}