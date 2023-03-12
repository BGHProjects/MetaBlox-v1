import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("MetaBlox burnMetaBlox tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ADDRESS WITHOUT CORRECT ROLE TO CALL FUNCTION
   * =====================================================================
   */
  it("Should not allow address without correct role to call function", async () => {
    const { MetaBloxContract, Alice, Bob } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.connect(Alice).burnMetaBlox(Bob.address, 1, 1)
    ).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW BURNING TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow burning to the zero address", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.burnMetaBlox(ZERO_ADDRESS, 1, 1)
    ).to.be.revertedWithCustomError(MetaBloxContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD RECOGNISE A TOKENID THAT DOESN'T EXIST
   * =====================================================================
   */
  it("Should recognise a token ID that doesn't exist", async () => {
    const { MetaBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.burnMetaBlox(Alice.address, 10, 1)
    ).to.be.revertedWithCustomError(MetaBloxContract, "InvalidTokenID");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW BURNING AN AMOUNT LESS THAN ONE
   * =====================================================================
   */
  it("Should not allow burning an amount less than one", async () => {
    const { MetaBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.burnMetaBlox(Alice.address, 1, 0)
    ).to.be.revertedWithCustomError(MetaBloxContract, "NotPositiveValue");
  });

  /**
   * =====================================================================
   *   SHOULD BURN TOKENS
   * =====================================================================
   */
  it("Should burn tokens", async () => {
    const { MetaBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(MetaBloxContract.mintMetaBlox(Alice.address, 1, 1)).to.not.be
      .reverted;

    expect(await MetaBloxContract.balanceOf(Alice.address, 1)).be.eq(1);

    await expect(MetaBloxContract.burnMetaBlox(Alice.address, 1, 1)).to.not.be
      .reverted;

    expect(await MetaBloxContract.balanceOf(Alice.address, 1)).be.eq(0);
  });
});
