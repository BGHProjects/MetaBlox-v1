import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("GameManager getPlayerColour tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN EMPTY STRING FOR NO COLOUR
   * =====================================================================
   */
  it("Should return empty string for no colour", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);

    const playerColour = await GameManagerContract.getPlayerColour(
      Alice.address
    );

    expect(playerColour).be.eq("");
  });

  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT COLOUR
   * =====================================================================
   */
  it("Should return correct colour", async () => {
    const { GameManagerContract, MBloxContract, Alice, testWorld1 } =
      await loadFixture(deployFixture);

    await MBloxContract.mintMBlox(
      Alice.address,
      ethers.utils.parseEther("150")
    );

    await GameManagerContract.purchaseWorld(
      "testDigitalKey",
      testWorld1,
      Alice.address
    );

    const playerColour = await GameManagerContract.getPlayerColour(
      Alice.address
    );

    expect(playerColour).be.eq("#fff000");
  });
});
