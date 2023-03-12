import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("Metablox metaBloxPrice tests", () => {
  /**
   * =====================================================================
   *   SHOULD RECOGNISE A TOKENID THAT DOESN'T EXIST
   * =====================================================================
   */
  it("Should recognise a token Id that doesn't exist", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.metaBloxPrice(10)
    ).to.be.revertedWithCustomError(MetaBloxContract, "InvalidTokenID");
  });

  /**
   * =====================================================================
   *   SHOULD RETURN PRICE FOR LOW COST BLOCK
   * =====================================================================
   */
  it("Should return price for low cost block", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    expect(await MetaBloxContract.metaBloxPrice(0)).be.eq(
      ethers.utils.parseEther("10")
    );
  });

  /**
   * =====================================================================
   *   SHOULD RETURN PRICE FOR MEDIUM COST BLOCK
   * =====================================================================
   */
  it("Should return price for medium cost block", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    expect(await MetaBloxContract.metaBloxPrice(4)).be.eq(
      ethers.utils.parseEther("15")
    );
  });

  /**
   * =====================================================================
   *   SHOULD RETURN PRICE FOR HIGH COST BLOCK
   * =====================================================================
   */
  it("Should return price for high cost block", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    expect(await MetaBloxContract.metaBloxPrice(9)).be.eq(
      ethers.utils.parseEther("20")
    );
  });
});
