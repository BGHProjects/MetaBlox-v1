import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager convertMATICtoMBLOX tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CONVERTING WITH AN INVALID DIGITAL KEY
   * =====================================================================
   */
  it("Should not allow converting with an invalid digital key", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.convertMATICtoMBLOX(
        "notTestDigitalKey",
        Alice.address,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidDigitalKey");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CONVERTING FOR THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow claiming by the zero address", async () => {
    const { GameManagerContract } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.convertMATICtoMBLOX("testDigitalKey", ZERO_ADDRESS, {
        value: ethers.utils.parseEther("0.1"),
      })
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CONVERTING FOR LESS THAN THE MATIC PRICE
   * =====================================================================
   */
  it("Should not allow claiming for less than the MATIC price", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);
    await expect(
      GameManagerContract.convertMATICtoMBLOX("testDigitalKey", Alice.address, {
        value: ethers.utils.parseEther("0.05"),
      })
    ).to.be.revertedWithCustomError(GameManagerContract, "InadequateMATIC");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW CONVERTING
   * =====================================================================
   */
  it("Should allow converting", async () => {
    const { GameManagerContract, Alice, MBloxContract, Recipient } =
      await loadFixture(deployFixture);
    await expect(
      GameManagerContract.convertMATICtoMBLOX("testDigitalKey", Alice.address, {
        value: ethers.utils.parseEther("0.1"),
      })
    ).to.not.be.reverted;

    const aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("1000");

    const recipientBalance = await Recipient.getBalance();
    const recBalInEther = ethers.utils.formatUnits(
      recipientBalance.toString(),
      "ether"
    );

    // Test accounts start with 10000 test eth
    expect(recBalInEther).be.eq("10000.1");
  });
});
