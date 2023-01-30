import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("GameManager getPlayerMETRBalance tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN 0 FOR NO CLAIMED BALANCE
   * =====================================================================
   */
  it("Should return 0 for no claimed balance", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);

    const metrBalance = await GameManagerContract.getPlayerMETRBalance(
      Alice.address
    );
    expect(metrBalance).be.eq(0);
  });

  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT CLAIMED METR BALANCE
   * =====================================================================
   */
  it("Should return correct claimed METR balance", async () => {
    const { GameManagerContract, Alice, TestMETRContract } = await loadFixture(
      deployFixture
    );

    await TestMETRContract.mintMBlox(Alice.address, 5);
    await GameManagerContract.claimMETRBalance("testDigitalKey", Alice.address);
    const metrBalance = await GameManagerContract.getPlayerMETRBalance(
      Alice.address
    );
    expect(metrBalance).be.eq(5);
  });
});
