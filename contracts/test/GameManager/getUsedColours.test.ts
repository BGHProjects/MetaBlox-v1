import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("GameManager getUsedColours tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN EMPTY ARRAY FOR NO COLOURS
   * =====================================================================
   */
  it("Should return empty array for no colours", async () => {
    const { GameManagerContract } = await loadFixture(deployFixture);

    const usedColours = await GameManagerContract.getUsedColours();

    expect(usedColours.length).be.eq(0);
  });

  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT ARRAY
   * =====================================================================
   */
  it("Should return correct array", async () => {
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

    const usedColours = await GameManagerContract.getUsedColours();

    expect(usedColours.length).be.eq(1);
    expect(usedColours[0]).be.eq("#fff000");
  });
});
