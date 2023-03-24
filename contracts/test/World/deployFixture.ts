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

  const gameWallet = ethers.Wallet.fromMnemonic(
    process.env.GAME_WALLET_MNEMONIC
  );

  const World_Contract = await ethers.getContractFactory("World", Deployer);

  WorldContract = await upgrades.deployProxy(World_Contract, [
    gameWallet.address,
  ]);

  await WorldContract.deployed();

  // Mock invalid signature
  const invalidMessageHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "address"],
      [Alice.address, Alice.address]
    )
  );

  const invalidSig = await gameWallet.signMessage(
    ethers.utils.arrayify(invalidMessageHash)
  );

  const invalidSignature = ethers.utils.arrayify(invalidSig);

  // Mock valid signature
  const validMessageHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(["address"], [Alice.address])
  );

  const validSig = await gameWallet.signMessage(
    ethers.utils.arrayify(validMessageHash)
  );

  const validSignature = ethers.utils.arrayify(validSig);

  return {
    Deployer,
    Alice,
    Bob,
    WorldContract,
    testWorld1,
    testWorld2,
    zeroAddressWorld,
    updatedWorldBlockDetails,
    validSignature,
    invalidSignature,
    gameWallet,
  };
};

export default deployFixture;
