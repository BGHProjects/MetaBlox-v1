import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("MetaBlox mintMetaBlox tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ADDRESS WITHOUT CORRECT ROLE TO CALL FUNCTION
   * =====================================================================
   */
  it("Should not allow address without correct role to call function", async () => {
    const { MetaBloxContract, Alice, Bob } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.connect(Alice).mintMetaBlox(Bob.address, 1, 1)
    ).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW MINTING TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow minting to the zero address", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.mintMetaBlox(ZERO_ADDRESS, 1, 1)
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
      MetaBloxContract.mintMetaBlox(Alice.address, 10, 1)
    ).to.be.revertedWithCustomError(MetaBloxContract, "InvalidTokenID");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW MINTING AN AMOUNT LESS THAN ONE
   * =====================================================================
   */
  it("Should not allow minting an amount less than one", async () => {
    const { MetaBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.mintMetaBlox(Alice.address, 1, 0)
    ).to.be.revertedWithCustomError(MetaBloxContract, "NotPositiveValue");
  });

  /**
   * =====================================================================
   *   SHOULD MINT TOKENS
   * =====================================================================
   */
  it("Should mint tokens", async () => {
    const { MetaBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(MetaBloxContract.mintMetaBlox(Alice.address, 1, 1)).to.not.be
      .reverted;

    expect(await MetaBloxContract.balanceOf(Alice.address, 1)).be.eq(1);
  });
});
