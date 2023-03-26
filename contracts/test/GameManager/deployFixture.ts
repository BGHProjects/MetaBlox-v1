import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  emptyBlockUpdates,
  testBlockUpdates,
  testWorld1,
  testWorld2,
  updatedWorldBlockDetails,
} from "../../constants/testHelpers";
import { MBlox, MetaBlox, World, GameManager } from "../../typechain-types";
const { ethers, upgrades } = require("hardhat");

let Deployer: SignerWithAddress;
let Recipient: SignerWithAddress;
let Alice: SignerWithAddress;
let Bob: SignerWithAddress;

let MBloxContract: MBlox;
let TestMETRContract: MBlox;
let MetaBloxContract: MetaBlox;
let WorldContract: World;
let GameManagerContract: GameManager;

const deployFixture = async () => {
  [Deployer, Recipient, Alice, Bob] = await ethers.getSigners();

  const gameWallet = ethers.Wallet.fromMnemonic(
    process.env.GAME_WALLET_MNEMONIC
  );

  // =======================
  //  DEPLOY MBLOX
  // =======================

  const MBlox_Contract = await ethers.getContractFactory("MBlox", Deployer);

  MBloxContract = await upgrades.deployProxy(MBlox_Contract, [
    gameWallet.address,
  ]);

  await MBloxContract.deployed();

  // =======================
  //  DEPLOY TEST METR
  // =======================

  const Test_METR_Contract = await ethers.getContractFactory("MBlox", Deployer);

  TestMETRContract = await upgrades.deployProxy(Test_METR_Contract, [
    gameWallet.address,
  ]);

  await TestMETRContract.deployed();

  // =======================
  //  DEPLOY METABLOX
  // =======================

  const MetaBlox_Contract = await ethers.getContractFactory(
    "MetaBlox",
    Deployer
  );

  MetaBloxContract = await upgrades.deployProxy(MetaBlox_Contract, [
    gameWallet.address,
  ]);

  await MetaBloxContract.deployed();

  // =======================
  //  DEPLOY WORLD
  // =======================

  const World_Contract = await ethers.getContractFactory("World", Deployer);

  WorldContract = await upgrades.deployProxy(World_Contract, [
    gameWallet.address,
  ]);

  await WorldContract.deployed();

  // =======================
  //  DEPLOY GAME MANAGER
  // =======================

  const GameManager_Contract = await ethers.getContractFactory(
    "GameManager",
    Deployer
  );

  GameManagerContract = await upgrades.deployProxy(GameManager_Contract, [
    gameWallet.address,
    TestMETRContract.address,
    MBloxContract.address,
    MetaBloxContract.address,
    WorldContract.address,
    Recipient.address,
  ]);

  await GameManagerContract.deployed();

  // ==========================
  //  GRANT GAME MANAGER ROLES
  // ==========================

  // Mock valid signature
  const validMessageHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address"],
      [GameManagerContract.address]
    )
  );

  const validSig = await gameWallet.signMessage(
    ethers.utils.arrayify(validMessageHash)
  );

  const validSignature = ethers.utils.arrayify(validSig);

  await MBloxContract.grantRoles(GameManagerContract.address, validSignature);

  await MetaBloxContract.grantRoles(
    GameManagerContract.address,
    validSignature
  );

  await WorldContract.grantRoles(GameManagerContract.address, validSignature);

  // ==========================
  //  GENERATE MOCK SIGNATURES
  // ==========================

  // Purchase Blocks

  const validPBHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256", "address", "string"],
      [1, 1, Alice.address, "dateTime"]
    )
  );
  const invalidPBSig = await Alice.signMessage(
    ethers.utils.arrayify(validPBHash)
  );
  const invalidPBSignature = ethers.utils.arrayify(invalidPBSig);

  // // Save World Changes

  // const validSWCHash = ethers.utils.keccak256(
  //   ethers.utils.defaultAbiCoder.encode(
  //     [
  //       "address",
  //       "uint256",
  //       {
  //         blockTotal: "uint256",
  //         worldLayout: "string",
  //       },
  //       {
  //         increaseIds: "uint256[]",
  //         increase: "uint256[]",
  //         decreaseIds: "uint256[]",
  //         decrease: "uint256[]",
  //       },
  //       "string",
  //     ],
  //     [
  //       Alice.address,
  //       0,
  //       updatedWorldBlockDetails,
  //       testBlockUpdates,
  //       "dateTime1",
  //     ]
  //   )
  // );

  // const validSWCSig = await gameWallet.signMessage(
  //   ethers.utils.arrayify(validSWCHash)
  // );
  // const validSWCSignature = ethers.utils.arrayify(validSWCSig);
  // const invalidSWCSig = await Alice.signMessage(
  //   ethers.utils.arrayify(validSWCHash)
  // );
  // const invalidSWCSignature = ethers.utils.arrayify(invalidSWCSig);

  // console.log("validSWCHash", validSWCHash);
  // console.log("validSWCSig", validSWCSig);
  // console.log("validSWCSignature", validSWCSignature);
  // console.log("invalidSWCSig", invalidSWCSig);
  // console.log("invalidSWCSignature", invalidSWCSignature);

  // // Convert Matic to MBlox

  // const validCMTMHash = ethers.utils.keccak256(
  //   ethers.utils.defaultAbiCoder.encode(
  //     ["address", "string"],
  //     [Alice.address, "dateTime1"]
  //   )
  // );

  // const validCMTMSig = await gameWallet.signMessage(
  //   ethers.utils.arrayify(validCMTMHash)
  // );
  // const validCMTMSignature = ethers.utils.arrayify(validCMTMSig);
  // const invalidCMTMSig = await Alice.signMessage(
  //   ethers.utils.arrayify(validCMTMHash)
  // );
  // const invalidCMTMSignature = ethers.utils.arrayify(invalidCMTMSig);

  // console.log("validCMTMHash", validCMTMHash);
  // console.log("validCMTMSig", validCMTMSig);
  // console.log("validCMTMSignature", validCMTMSignature);
  // console.log("invalidCMTMSig", invalidCMTMSig);
  // console.log("invalidCMTMSignature", invalidCMTMSignature);

  // // Claim METR

  // const validCMHash = ethers.utils.keccak256(
  //   ethers.utils.defaultAbiCoder.encode(
  //     ["address", "string"],
  //     [Alice.address, "dateTime2"]
  //   )
  // );

  // const validCMSig = await gameWallet.signMessage(
  //   ethers.utils.arrayify(validCMHash)
  // );
  // const validCMSignature = ethers.utils.arrayify(validCMSig);
  // const invalidCMSig = await Alice.signMessage(
  //   ethers.utils.arrayify(validCMHash)
  // );
  // const invalidCMSignature = ethers.utils.arrayify(invalidCMSig);

  // console.log("validCMHash", validCMHash);
  // console.log("validCMSig", validCMSig);
  // console.log("validCMSignature", validCMSignature);
  // console.log("invalidCMSig", invalidCMSig);
  // console.log("invalidCMSignature", invalidCMSignature);

  return {
    Deployer,
    Recipient,
    Alice,
    Bob,
    testWorld1,
    testWorld2,
    updatedWorldBlockDetails,
    testBlockUpdates,
    emptyBlockUpdates,
    MBloxContract,
    TestMETRContract,
    WorldContract,
    MetaBloxContract,
    GameManagerContract,
    gameWallet,
    invalidPBSignature,
    // validPWSignature,
    // invalidPWSignature,
    // validSWCSignature,
    // invalidSWCSignature,
    // validCMTMSignature,
    // invalidCMTMSignature,
    // validCMSignature,
    // invalidCMSignature,
  };
};

export default deployFixture;
