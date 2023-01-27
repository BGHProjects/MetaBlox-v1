// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IWorld.sol";
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

    // Restricts use to authorised callers
    string private _digitalKey;

    // Holds World data to be accessed by the game
    mapping(uint256 => WorldMetadata) public worlds;

    // Tracks token IDs
    CountersUpgradeable.Counter private _tokenIdCounter;
    
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
    function generateImage(WorldMetadata storage worldMetaData) private view returns(string memory)
    {
        return "";
    }

    /**
     * =========================
     *  GENERATE BLOCK METADATA
     * =========================
     */
    function generateBlockMetadata(string memory blockType, uint256 blockTotal) private pure returns(string memory)
    {
        string memory result = '"';
        result = string.concat(result, blockType);
        result = string.concat(result, 'Blocks": "');
        result = string.concat(result, blockTotal.toString());
        result = string.concat(result, '",');
        return result;
    }

     /**
     * ===============================
     *  GENERATE THREE BLOCK METADATA
     * ===============================
     */
    function generateThreeBlockMetadata(string memory blockType1, uint256 blockTotal1,string memory blockType2, uint256 blockTotal2, string memory blockType3, uint256 blockTotal3) private pure returns(string memory)
    {
        string memory block1 = generateBlockMetadata(blockType1, blockTotal1);
        string memory block2 = generateBlockMetadata(blockType2, blockTotal2);
        string memory block3 = generateBlockMetadata(blockType3, blockTotal3);

        string memory result = string.concat(block1, block2);
        result = string.concat(result, block3);

        return result;
    }

    /**
     * =======================
     *  GENERATE METADATA
     * =======================
     */
    function generateMetadata(uint256 tokenId) private view returns(string memory)
    {
        WorldMetadata storage metadata = worlds[tokenId];

        // Abbreviations for cleanliness
        uint256[] memory blockTotals = metadata.worldBlockDetails.blockTotals;
        Coordinates memory coords = metadata.worldGridData.coords;

        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "MetaBlox World #', tokenId.toString(), '",',
            '"image": "', generateImage(metadata), '",',
            '"X": "', coords.x.toString(), '",',
            '"Y": "', coords.y.toString(), '",',
            generateThreeBlockMetadata("Grass", blockTotals[0], "Log", blockTotals[1], "Dirt", blockTotals[2]),
            generateThreeBlockMetadata( "Wood", blockTotals[3], "Glass", blockTotals[4], "Gold", blockTotals[5]),
            generateThreeBlockMetadata( "Opal", blockTotals[6], "SpaceInvaders", blockTotals[7], "PacMan", blockTotals[8]),
            generateBlockMetadata("Total", blockTotals[9]),
            '"World Layout": "', metadata.worldBlockDetails.worldLayout, '",',
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    /**
     * =======================
     *  UPDATE METADATA
     * =======================
     */
    function updateMetadata(uint256 tokenId, WorldBlockDetails calldata worldBlockDetails) private view returns(string memory)
    {
        WorldMetadata storage metadata = worlds[tokenId];

        // Abbreviations for cleanliness
        Coordinates memory coords = metadata.worldGridData.coords;
        uint256[] memory blockTotals = worldBlockDetails.blockTotals;

        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "MetaBlox World #', tokenId.toString(), '",',
            '"image": "', generateImage(metadata), '",',
            '"X": "', coords.x.toString(), '",',
            '"Y": "', coords.y.toString(), '",',
            generateThreeBlockMetadata("Grass", blockTotals[0], "Log", blockTotals[1], "Dirt", blockTotals[2]),
            generateThreeBlockMetadata( "Wood", blockTotals[3], "Glass", blockTotals[4], "Gold", blockTotals[5]),
            generateThreeBlockMetadata( "Opal", blockTotals[6], "SpaceInvaders", blockTotals[7], "PacMan", blockTotals[8]),
            generateBlockMetadata("Total", blockTotals[9]),
            '"World Layout": "', metadata.worldBlockDetails.worldLayout, '",',
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    /**
     * =======================
     *  MINT WORLD
     * =======================
     */
    function mintWorld(address to, WorldMetadata calldata worldData) public onlyRole(MINTER_ROLE){
        if(to == address(0)) revert ZeroAddress();

        uint256 totalWorlds = _tokenIdCounter.current() + 1;
        Coordinates memory coords = worldData.worldGridData.coords;

        for (uint256 i = 0; i < totalWorlds; i++)
        {
            if(worlds[i].worldGridData.coords.x == coords.x && worlds[i].worldGridData.coords.y == coords.y) revert AlreadyOnGrid();   
        }

        uint256 tokenId = _tokenIdCounter.current();
        worlds[tokenId] = worldData; // Sets worlds entry so it can be used by generateMetadata
        string memory uri = generateMetadata(tokenId);

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

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
        WorldBlockDetails calldata worldBlockDetails
    ) public onlyRole(UPDATER_ROLE) {
        if(keccak256(bytes((worlds[tokenId].colour))) == keccak256(bytes(("")))) revert InvalidTokenID();

        string memory updatedURI = updateMetadata(tokenId, worldBlockDetails);
        _setTokenURI(tokenId, updatedURI);

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