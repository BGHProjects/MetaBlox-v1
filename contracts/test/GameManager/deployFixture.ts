import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
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

const testDigitalKey = "testDigitalKey";

const deployFixture = async () => {
  [Deployer, Recipient, Alice, Bob] = await ethers.getSigners();

  // =======================
  //  DEPLOY MBLOX
  // =======================

  const MBlox_Contract = await ethers.getContractFactory("MBlox", Deployer);

  MBloxContract = await upgrades.deployProxy(MBlox_Contract, [testDigitalKey]);

  await MBloxContract.deployed();

  // =======================
  //  DEPLOY TEST METR
  // =======================

  const Test_METR_Contract = await ethers.getContractFactory("MBlox", Deployer);

  TestMETRContract = await upgrades.deployProxy(Test_METR_Contract, [
    testDigitalKey,
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
    testDigitalKey,
  ]);

  await MetaBloxContract.deployed();

  // =======================
  //  DEPLOY WORLD
  // =======================

  const World_Contract = await ethers.getContractFactory("World", Deployer);

  WorldContract = await upgrades.deployProxy(World_Contract, [testDigitalKey]);

  await WorldContract.deployed();

  // =======================
  //  DEPLOY GAME MANAGER
  // =======================

  const GameManager_Contract = await ethers.getContractFactory(
    "GameManager",
    Deployer
  );

  GameManagerContract = await upgrades.deployProxy(GameManager_Contract, [
    testDigitalKey,
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

  await MBloxContract.grantRoles(GameManagerContract.address, testDigitalKey);

  await MetaBloxContract.grantRoles(
    GameManagerContract.address,
    testDigitalKey
  );

  await WorldContract.grantRoles(GameManagerContract.address, testDigitalKey);

  return {
    Deployer,
    Recipient,
    Alice,
    Bob,
    testWorld1,
    testWorld2,
    updatedWorldBlockDetails,
    MBloxContract,
    TestMETRContract,
    WorldContract,
    MetaBloxContract,
    GameManagerContract,
  };
};

export default deployFixture;
