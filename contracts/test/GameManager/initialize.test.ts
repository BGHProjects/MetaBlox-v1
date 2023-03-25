import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";
const { ethers, upgrades } = require("hardhat");

describe("GameManager initialize tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW RE-INITIALIZING
   * =====================================================================
   */
  it("Should not allow re-initializing", async () => {
    const {
      GameManagerContract,
      Recipient,
      MBloxContract,
      MetaBloxContract,
      WorldContract,
      TestMETRContract,
      gameWallet,
    } = await loadFixture(deployFixture);

    await expect(
      GameManagerContract.initialize(
        gameWallet.address,
        TestMETRContract.address,
        MBloxContract.address,
        MetaBloxContract.address,
        WorldContract.address,
        Recipient.address
      )
    ).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SETTING METR CONTRACT TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow setting METR contract to the zero address", async () => {
    const {
      GameManagerContract,
      Recipient,
      MBloxContract,
      MetaBloxContract,
      WorldContract,
      Deployer,
      gameWallet,
    } = await loadFixture(deployFixture);

    const GameManager_Contract = await ethers.getContractFactory(
      "GameManager",
      Deployer
    );

    await expect(
      upgrades.deployProxy(GameManager_Contract, [
        gameWallet.address,
        ZERO_ADDRESS,
        MBloxContract.address,
        MetaBloxContract.address,
        WorldContract.address,
        Recipient.address,
      ])
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SETTING MBLOX CONTRACT TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow setting MBlox contract to the zero address", async () => {
    const {
      GameManagerContract,
      Recipient,
      MetaBloxContract,
      WorldContract,
      TestMETRContract,
      Deployer,
      gameWallet,
    } = await loadFixture(deployFixture);

    const GameManager_Contract = await ethers.getContractFactory(
      "GameManager",
      Deployer
    );

    await expect(
      upgrades.deployProxy(GameManager_Contract, [
        gameWallet.address,
        TestMETRContract.address,
        ZERO_ADDRESS,
        MetaBloxContract.address,
        WorldContract.address,
        Recipient.address,
      ])
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SETTING METABLOX CONTRACT TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow setting MetaBlox contract to the zero address", async () => {
    const {
      GameManagerContract,
      Recipient,
      MBloxContract,
      WorldContract,
      TestMETRContract,
      Deployer,
      gameWallet,
    } = await loadFixture(deployFixture);

    const GameManager_Contract = await ethers.getContractFactory(
      "GameManager",
      Deployer
    );

    await expect(
      upgrades.deployProxy(GameManager_Contract, [
        gameWallet.address,
        TestMETRContract.address,
        MBloxContract.address,
        ZERO_ADDRESS,
        WorldContract.address,
        Recipient.address,
      ])
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SETTING WORLD CONTRACT TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow setting World contract to the zero address", async () => {
    const {
      GameManagerContract,
      Recipient,
      MBloxContract,
      MetaBloxContract,
      TestMETRContract,
      Deployer,
      gameWallet,
    } = await loadFixture(deployFixture);

    const GameManager_Contract = await ethers.getContractFactory(
      "GameManager",
      Deployer
    );

    await expect(
      upgrades.deployProxy(GameManager_Contract, [
        gameWallet.address,
        TestMETRContract.address,
        MBloxContract.address,
        MetaBloxContract.address,
        ZERO_ADDRESS,
        Recipient.address,
      ])
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SETTING RECIPIENT TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow setting Recipient to the zero address", async () => {
    const {
      GameManagerContract,
      MBloxContract,
      MetaBloxContract,
      WorldContract,
      TestMETRContract,
      Deployer,
      gameWallet,
    } = await loadFixture(deployFixture);

    const GameManager_Contract = await ethers.getContractFactory(
      "GameManager",
      Deployer
    );

    await expect(
      upgrades.deployProxy(GameManager_Contract, [
        gameWallet.address,
        TestMETRContract.address,
        MBloxContract.address,
        MetaBloxContract.address,
        WorldContract.address,
        ZERO_ADDRESS,
      ])
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });
});
