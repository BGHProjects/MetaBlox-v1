import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("GameManager saveWorldChanges tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SAVING CHANGES WITH AN INVALID DIGITAL KEY
   * =====================================================================
   */
  it("Should not allow saving changes with an invalid digital key", async () => {
    const {
      GameManagerContract,
      Alice,
      updatedWorldBlockDetails,
      emptyBlockUpdates,
    } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.saveWorldChanges(
        "notTestDigitalKey",
        Alice.address,
        0,
        updatedWorldBlockDetails,
        emptyBlockUpdates
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidDigitalKey");
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
    } = await loadFixture(deployFixture);

    // Mint the World to be updated
    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    let totalWorlds = await WorldContract._tokenIdCounter();
    let convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(1);

    // Update World
    await expect(
      GameManagerContract.saveWorldChanges(
        "testDigitalKey",
        Alice.address,
        0,
        updatedWorldBlockDetails,
        emptyBlockUpdates
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

    // Update World
    await expect(
      GameManagerContract.saveWorldChanges(
        "testDigitalKey",
        Alice.address,
        0,
        updatedWorldBlockDetails,
        testBlockUpdates
      )
    ).to.not.be.reverted;

    expect(await MetaBloxContract.balanceOf(Alice.address, 0)).be.eq(7);
    expect(await MetaBloxContract.balanceOf(Alice.address, 1)).be.eq(8);
    expect(await MetaBloxContract.balanceOf(Alice.address, 2)).be.eq(4);
    expect(await MetaBloxContract.balanceOf(Alice.address, 3)).be.eq(1);
  });
});
