import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MetaBlox } from "../../typechain-types";
const { ethers, upgrades } = require("hardhat");

let Deployer: SignerWithAddress;
let Alice: SignerWithAddress;
let Bob: SignerWithAddress;

let MetaBloxContract: MetaBlox;

const deployFixture = async () => {
  [Deployer, Alice, Bob] = await ethers.getSigners();

  const MetaBlox_Contract = await ethers.getContractFactory(
    "MetaBlox",
    Deployer
  );

  MetaBloxContract = await upgrades.deployProxy(MetaBlox_Contract, [
    "testDigitalKey",
  ]);

  await MetaBloxContract.deployed();

  return {
    Deployer,
    Alice,
    Bob,
    MetaBloxContract,
  };
};

export default deployFixture;
