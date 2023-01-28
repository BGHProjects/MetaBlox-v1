import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("World updateWorld tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ADDRESS WITHOUT CORRECT ROLE TO CALL FUNCTION
   * =====================================================================
   */
  it("Should not allow address without correct role to call function", async () => {
    const { WorldContract, Alice, updatedWorldBlockDetails } =
      await loadFixture(deployFixture);

    await expect(
      WorldContract.connect(Alice).updateWorld(0, updatedWorldBlockDetails)
    ).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD REVERT FOR WORLD THAT DOESN'T EXIST
   * =====================================================================
   */
  it("Should revert for World that doesn't exist", async () => {
    const { WorldContract, updatedWorldBlockDetails } = await loadFixture(
      deployFixture
    );

    await expect(
      WorldContract.updateWorld(0, updatedWorldBlockDetails)
    ).to.be.revertedWithCustomError(WorldContract, "InvalidTokenID");
  });

  /**
   * =====================================================================
   *   SHOULD UPDATE WORLD
   * =====================================================================
   */
  it("Should update world", async () => {
    const { WorldContract, updatedWorldBlockDetails, Alice, testWorld1 } =
      await loadFixture(deployFixture);

    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    let tokenURI = await WorldContract.tokenURI(0);
    let tokenURIDecoded = Buffer.from(
      tokenURI.substring(tokenURI.indexOf(",") + 1),
      "base64"
    ).toString();
    let tokenURIJSON = JSON.parse(tokenURIDecoded);

    expect(tokenURIJSON["Total Blocks"]).eq("5");
    expect(tokenURIJSON["World Layout"]).eq("testWorldLayout1");

    await expect(WorldContract.updateWorld(0, updatedWorldBlockDetails)).to.not
      .be.reverted;

    tokenURI = await WorldContract.tokenURI(0);
    tokenURIDecoded = Buffer.from(
      tokenURI.substring(tokenURI.indexOf(",") + 1),
      "base64"
    ).toString();
    tokenURIJSON = JSON.parse(tokenURIDecoded);

    expect(tokenURIJSON["Total Blocks"]).eq("10");
    expect(tokenURIJSON["World Layout"]).eq("updatedWorldLayout");
  });
});
