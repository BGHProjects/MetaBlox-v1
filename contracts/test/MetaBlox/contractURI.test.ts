import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("MetaBlox contractURI tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT CONTRACT URI
   * =====================================================================
   */
  it("Should return the contract's URI", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    expect(await MetaBloxContract.contractURI()).be.eq(
      "ipfs://QmQ5QgpmPgrdeMEDkX12cmhTjsqHPX98K9dKPggFd3tZKT"
    );
  });
});
