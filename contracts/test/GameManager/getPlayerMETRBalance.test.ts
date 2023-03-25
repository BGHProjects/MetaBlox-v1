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
    const { GameManagerContract, Alice, TestMETRContract, gameWallet } =
      await loadFixture(deployFixture);

    await TestMETRContract.mintMBlox(Alice.address, 5);

    const eu = ethers.utils;

    const data = eu.defaultAbiCoder.encode(
      ["address", "string"],
      [Alice.address, "dateTime1"]
    );

    const hash = eu.keccak256(data);

    const sig = await gameWallet.signMessage(eu.arrayify(hash));

    await expect(
      GameManagerContract.claimMETRBalance(Alice.address, "dateTime1", sig)
    ).to.not.be.reverted;

    const metrBalance = await GameManagerContract.getPlayerMETRBalance(
      Alice.address
    );
    expect(metrBalance).be.eq(5);
  });
});
