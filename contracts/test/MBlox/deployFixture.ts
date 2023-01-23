import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MBlox } from "../../typechain-types";
const { ethers, upgrades } = require("hardhat");

let Deployer: SignerWithAddress;
let Alice: SignerWithAddress;
let Bob: SignerWithAddress;

let MBloxContract: MBlox;

const deployFixture = async () => {
  [Deployer, Alice, Bob] = await ethers.getSigners();

  const MBlox_Contract = await ethers.getContractFactory("MBlox", Deployer);

  MBloxContract = await upgrades.deployProxy(MBlox_Contract, [
    "testDigitalKey",
  ]);
  await MBloxContract.deployed();

  return {
    Deployer,
    Alice,
    Bob,
    MBloxContract,
  };
};

export default deployFixture;
