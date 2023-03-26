import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("GameManager saveWorldChanges tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SAVING CHANGES WITH AN INVALID SIGNATURE
   * =====================================================================
   */
  it("Should not allow saving changes with an invalid signature", async () => {
    const {
      GameManagerContract,
      Alice,
      updatedWorldBlockDetails,
      emptyBlockUpdates,
      invalidPBSignature,
    } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.saveWorldChanges(
        Alice.address,
        0,
        updatedWorldBlockDetails,
        emptyBlockUpdates,
        "dateTime1",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidSignature");
  });

  /**
   * =====================================================================
   *   SHOULD CORRECTLY SAVE WORLD CHANGES WITHOUT BLOCK UPDATES
   * =====================================================================
   */
  it("Should correctly save World changes without block updates", async () => {
    const {
      GameManagerContract,
      WorldContract,
      Alice,
      testWorld1,
      updatedWorldBlockDetails,
      emptyBlockUpdates,
      gameWallet,
    } = await loadFixture(deployFixture);

    // Mint the World to be updated
    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    let totalWorlds = await WorldContract._tokenIdCounter();
    let convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(1);

    const eu = ethers.utils;

    const data = eu.defaultAbiCoder.encode(
      [
        "address",
        "uint256",
        "tuple(uint256 blockTotal, string worldLayout) worldBlockDetails",
        "tuple(uint256[] increases, uint256[] increaseIds, uint256[] decreases, uint256[] decreaseIds) blockUpdates",
        "string",
      ],
      [
        Alice.address,
        0,
        updatedWorldBlockDetails,
        emptyBlockUpdates,
        "dateTime1",
      ]
    );

    const hash = eu.keccak256(data);

    const sig = await gameWallet.signMessage(eu.arrayify(hash));

    // Update World
    await expect(
      GameManagerContract.saveWorldChanges(
        Alice.address,
        0,
        updatedWorldBlockDetails,
        emptyBlockUpdates,
        "dateTime1",
        sig
      )
    ).to.not.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD CORRECTLY SAVE WORLD CHANGES WITH BLOCK UPDATES
   * =====================================================================
   */
  it("Should correctly save World changes with block updates", async () => {
    const {
      GameManagerContract,
      WorldContract,
      MetaBloxContract,
      Alice,
      testWorld1,
      updatedWorldBlockDetails,
      testBlockUpdates,
      gameWallet,
    } = await loadFixture(deployFixture);

    // Mint the World to be updated
    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    let totalWorlds = await WorldContract._tokenIdCounter();
    let convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(1);

    // Mint MetaBlox to be updated
    await expect(
      MetaBloxContract.batchMintMetaBlox(
        Alice.address,
        [0, 1, 2, 3],
        [5, 5, 5, 5]
      )
    ).to.not.be.reverted;

    expect(await MetaBloxContract.balanceOf(Alice.address, 0)).be.eq(5);
    expect(await MetaBloxContract.balanceOf(Alice.address, 1)).be.eq(5);
    expect(await MetaBloxContract.balanceOf(Alice.address, 2)).be.eq(5);
    expect(await MetaBloxContract.balanceOf(Alice.address, 3)).be.eq(5);

    const eu = ethers.utils;

    const data = eu.defaultAbiCoder.encode(
      [
        "address",
        "uint256",
        "tuple(uint256 blockTotal, string worldLayout) worldBlockDetails",
        "tuple(uint256[] increaseIds, uint256[] increases, uint256[] decreaseIds, uint256[] decreases) blockUpdates",
        "string",
      ],
      [
        Alice.address,
        0,
        updatedWorldBlockDetails,
        testBlockUpdates,
        "dateTime1",
      ]
    );

    const hash = eu.keccak256(data);

    const sig = await gameWallet.signMessage(eu.arrayify(hash));

    // Update World
    await expect(
      GameManagerContract.saveWorldChanges(
        Alice.address,
        0,
        updatedWorldBlockDetails,
        testBlockUpdates,
        "dateTime1",
        sig
      )
    ).to.not.be.reverted;

    expect(await MetaBloxContract.balanceOf(Alice.address, 0)).be.eq(7);
    expect(await MetaBloxContract.balanceOf(Alice.address, 1)).be.eq(8);
    expect(await MetaBloxContract.balanceOf(Alice.address, 2)).be.eq(4);
    expect(await MetaBloxContract.balanceOf(Alice.address, 3)).be.eq(1);
  });
});
