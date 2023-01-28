import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
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

  const testWorld1 = {
    worldGridData: {
      owner: "0xd5e099c71b797516c10ed0f0d895f429c2781142",
      coords: {
        x: 1,
        y: 2,
      },
    },
    worldBlockDetails: {
      blockTotal: 5,
      worldLayout: "testWorldLayout1",
    },
    colour: "#fff000",
  };

  const testWorld2 = {
    worldGridData: {
      owner: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      coords: {
        x: 3,
        y: 4,
      },
    },
    worldBlockDetails: {
      blockTotal: 6,
      worldLayout: "testWorldLayout2",
    },
    colour: "#fff000",
  };

  const zeroAddressWorld = {
    worldGridData: {
      owner: ZERO_ADDRESS,
      coords: {
        x: 3,
        y: 4,
      },
    },
    worldBlockDetails: {
      blockTotal: 6,
      worldLayout: "testWorldLayout2",
    },
    colour: "#fff000",
  };

  const updatedWorldBlockDetails = {
    blockTotal: 10,
    worldLayout: "updatedWorldLayout",
  };

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
