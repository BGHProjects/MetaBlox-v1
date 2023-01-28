import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("World contractURI tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT CONTRACT URI
   * =====================================================================
   */
  it("Should return the contract's URI", async () => {
    const { WorldContract } = await loadFixture(deployFixture);

    expect(await WorldContract.contractURI()).be.eq("https://contracturi");
  });
});
