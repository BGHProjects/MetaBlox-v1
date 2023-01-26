import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("MetaBlox setURI tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW AN UNAUTHORISED ACCOUNT TO SET THE URI
   * =====================================================================
   */
  it("Should not allow an unauthorised account to set the URI", async () => {
    const { MetaBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MetaBloxContract.connect(Alice).setURI("https://thisShouldFail")
    ).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW THE SETTING OF THE URI BY AN AUTHORISED ACCOUNT
   * =====================================================================
   */
  it("Should allow the setting of the URI by an authorised account", async () => {
    const { MetaBloxContract } = await loadFixture(deployFixture);

    await expect(MetaBloxContract.setURI("https://thisShouldPass")).to.not.be
      .reverted;

    expect(await MetaBloxContract.uri(1)).be.eq("https://thisShouldPass");
  });
});
