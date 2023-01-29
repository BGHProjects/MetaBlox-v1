import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager claimMETRBalance tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CLAIMING WITH AN INVALID DIGITAL KEY
   * =====================================================================
   */
  it("Should not allow claiming with an invalid digital key", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.claimMETRBalance("notTestDigitalKey", Alice.address)
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidDigitalKey");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CLAIMING BY THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow claiming by the zero address", async () => {
    const { GameManagerContract } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.claimMETRBalance("testDigitalKey", ZERO_ADDRESS)
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CLAIMING IF THE USER HAS NO METR TO CLAIM
   * =====================================================================
   */
  it("Should not allow claiming if the user has not METR to claim", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.claimMETRBalance("testDigitalKey", Alice.address)
    ).to.be.revertedWithCustomError(GameManagerContract, "NoMETRToClaim");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW CLAIMING METR
   * =====================================================================
   */

  it("Should allow claiming METR", async () => {
    const { GameManagerContract, Alice, TestMETRContract, MBloxContract } =
      await loadFixture(deployFixture);

    await TestMETRContract.mintMBlox(Alice.address, 5);

    await expect(
      GameManagerContract.claimMETRBalance("testDigitalKey", Alice.address)
    ).to.not.be.reverted;

    const aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("5");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOWING SUBSEQUENT CLAIM FOR CORRECT AMOUNT
   * =====================================================================
   */

  it("Should allow subsequent claim for correct amount", async () => {
    const { GameManagerContract, Alice, TestMETRContract, MBloxContract } =
      await loadFixture(deployFixture);

    await TestMETRContract.mintMBlox(Alice.address, 5);

    await expect(
      GameManagerContract.claimMETRBalance("testDigitalKey", Alice.address)
    ).to.not.be.reverted;

    let aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("5");

    await TestMETRContract.mintMBlox(Alice.address, 1);

    await expect(
      GameManagerContract.claimMETRBalance("testDigitalKey", Alice.address)
    ).to.not.be.reverted;

    aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("6");
  });
});
