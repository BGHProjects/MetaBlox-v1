import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("MetaBlox contractURI tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT CONTRACT URI
   * =====================================================================
   */
  it("Should not allow re-initializing", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    expect(await MetaBloxContract.contractURI()).be.eq("https://contracturi");
  });
});
