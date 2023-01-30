import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumberish, ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("GameManager getGridData tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN EMPTY ARRAY FOR NO WORLDS ON THE GRID
   * =====================================================================
   */
  it("Should return empty array for no Worlds on the grid", async () => {
    const { GameManagerContract } = await loadFixture(deployFixture);

    const gridData = await GameManagerContract.getGridData();

    expect(gridData.length).be.eq(0);
  });

  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT GRID DATA
   * =====================================================================
   */
  it("Should return correct grid data", async () => {
    const { GameManagerContract, MBloxContract, Alice, testWorld1 } =
      await loadFixture(deployFixture);

    await MBloxContract.mintMBlox(Alice.address, 150);

    await GameManagerContract.purchaseWorld(
      "testDigitalKey",
      testWorld1,
      Alice.address
    );

    const gridData = await GameManagerContract.getGridData();

    expect(gridData.length).be.eq(1);

    const jsonElement = JSON.parse(JSON.stringify(gridData[0]));

    const converToInt = (bigNumber: BigNumberish) =>
      Number(ethers.utils.formatEther(bigNumber)) * 10 ** 18;

    expect(converToInt(jsonElement[0]), "ether").be.eq(1);
    expect(jsonElement[1]).be.eq("#fff000");
    expect(converToInt(jsonElement[2]), "ether").be.eq(1);
    expect(converToInt(jsonElement[3]), "ether").be.eq(2);
  });
});
