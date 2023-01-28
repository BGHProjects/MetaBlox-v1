import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("World tokenURI tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ADDRESS WITHOUT CORRECT ROLE TO CALL FUNCTION
   * =====================================================================
   */
  it("Should not allow address without correct role to call function", async () => {
    const { WorldContract, Alice } = await loadFixture(deployFixture);

    await expect(WorldContract.connect(Alice).tokenURI(1)).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD RETURN THE CORRECT TOKENURI
   * =====================================================================
   */
  it("Should return the correct tokenURI", async () => {
    const { WorldContract, Alice, testWorld1 } = await loadFixture(
      deployFixture
    );

    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    const tokenURI = await WorldContract.tokenURI(0);
    const tokenURIDecoded = Buffer.from(
      tokenURI.substring(tokenURI.indexOf(",") + 1),
      "base64"
    ).toString();
    const tokenURIJSON = JSON.parse(tokenURIDecoded);

    expect(tokenURIJSON.name).eq("MetaBlox World #0");
    expect(tokenURIJSON.X).eq("1");
    expect(tokenURIJSON.Y).eq("2");
    expect(tokenURIJSON["Total Blocks"]).eq("5");
    expect(tokenURIJSON["World Layout"]).eq("testWorldLayout1");
  });
});
