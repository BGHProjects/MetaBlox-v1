import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager purchaseBlocks tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITH AN INVALID DIGITAL KEY
   * =====================================================================
   */
  it("Should not allow purchase with an invalid digital key", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.purchaseBlocks(
        "notTestDigitalKey",
        1,
        1,
        Alice.address
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidDigitalKey");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE BY THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow purchase by the zero address", async () => {
    const { GameManagerContract } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.purchaseBlocks("testDigitalKey", 1, 1, ZERO_ADDRESS)
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITH A NON-POSITIVE AMOUNT
   * =====================================================================
   */
  it("Should not allow purchase with a non-positive amount", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.purchaseBlocks("testDigitalKey", 1, 0, Alice.address)
    ).to.be.revertedWithCustomError(GameManagerContract, "NotPositiveValue");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE OF INVALID BLOCK TYPE
   * =====================================================================
   */
  it("Should not allow purchase of invalid block type", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.purchaseBlocks("testDigitalKey", 13, 1, Alice.address)
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidTokenID");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITHOUT ADEQUATE MBLOX BALANCE
   * =====================================================================
   */
  it("Should not allow purchase without adequate MBLOX balance", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.purchaseBlocks("testDigitalKey", 1, 1, Alice.address)
    ).to.be.revertedWithCustomError(GameManagerContract, "InadequateMBLOX");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW PURCHASE
   * =====================================================================
   */
  it("Should allow purchase", async () => {
    const { GameManagerContract, Alice, MBloxContract, MetaBloxContract } =
      await loadFixture(deployFixture);

    await MBloxContract.mintMBlox(Alice.address, 100);

    await expect(
      GameManagerContract.purchaseBlocks("testDigitalKey", 1, 1, Alice.address)
    ).to.not.be.reverted;

    const mbloxBalance = await MBloxContract.balanceOf(Alice.address);
    expect(mbloxBalance).be.eq(90);

    const type1Balance = await MetaBloxContract.balanceOf(Alice.address, 1);
    expect(type1Balance).be.eq(1);
  });
});
