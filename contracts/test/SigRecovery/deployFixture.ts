import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MBlox } from "../../typechain-types";
const { ethers, upgrades } = require("hardhat");

let Deployer: SignerWithAddress;
let Alice: SignerWithAddress;
let Bob: SignerWithAddress;

let MBloxContract: MBlox;

/**
 * This deployFixture is just going to use the same variables as the MBlox deployFixtue
 * This is for convenience purposes, as it is easier to fully test the SigRecovery contract using existing functionality
 * rather than developing a personalised test suite specific for the SigRecovery contract
 * @returns Variables used for testing
 */
const deployFixture = async () => {
  [Deployer, Alice, Bob] = await ethers.getSigners();

  const gameWallet = ethers.Wallet.fromMnemonic(
    process.env.GAME_WALLET_MNEMONIC
  );

  const MBlox_Contract = await ethers.getContractFactory("MBlox", Deployer);

  MBloxContract = await upgrades.deployProxy(MBlox_Contract, [
    gameWallet.address,
  ]);
  await MBloxContract.deployed();

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
    MBloxContract,
    gameWallet,
    validSignature,
    invalidSignature,
    validMessageHash,
  };
};

export default deployFixture;
