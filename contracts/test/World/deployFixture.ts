import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  testWorld1,
  testWorld2,
  updatedWorldBlockDetails,
  zeroAddressWorld,
} from "../../constants/testHelpers";
import { World } from "../../typechain-types";
const { ethers, upgrades } = require("hardhat");

let Deployer: SignerWithAddress;
let Alice: SignerWithAddress;
let Bob: SignerWithAddress;

let WorldContract: World;

const deployFixture = async () => {
  [Deployer, Alice, Bob] = await ethers.getSigners();

  const World_Contract = await ethers.getContractFactory("World", Deployer);

  WorldContract = await upgrades.deployProxy(World_Contract, [
    "testDigitalKey",
  ]);

  await WorldContract.deployed();

  return {
    Deployer,
    Alice,
    Bob,
    WorldContract,
    testWorld1,
    testWorld2,
    zeroAddressWorld,
    updatedWorldBlockDetails,
  };
};

export default deployFixture;
