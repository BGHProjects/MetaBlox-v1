import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager convertMATICtoMBLOX tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CONVERTING FOR THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow claiming by the zero address", async () => {
    const { GameManagerContract, invalidPBSignature } = await loadFixture(
      deployFixture
    );
    await expect(
      GameManagerContract.convertMATICtoMBLOX(
        ZERO_ADDRESS,
        "dateTime",
        invalidPBSignature,
        {
          value: ethers.utils.parseEther("0.1"),
        }
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CONVERTING FOR LESS THAN THE MATIC PRICE
   * =====================================================================
   */
  it("Should not allow claiming for less than the MATIC price", async () => {
    const { GameManagerContract, Alice, invalidPBSignature } =
      await loadFixture(deployFixture);
    await expect(
      GameManagerContract.convertMATICtoMBLOX(
        Alice.address,
        "dateTime",
        invalidPBSignature,
        {
          value: ethers.utils.parseEther("0.05"),
        }
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InadequateMATIC");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CONVERTING WITH AN INVALID SIGNATURE
   * =====================================================================
   */
  it("Should not allow converting with an invalid signature", async () => {
    const { GameManagerContract, Alice, invalidPBSignature } =
      await loadFixture(deployFixture);
    await expect(
      GameManagerContract.convertMATICtoMBLOX(
        Alice.address,
        "dateTime",
        invalidPBSignature,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidSignature");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW CONVERTING
   * =====================================================================
   */
  it("Should allow converting", async () => {
    const { GameManagerContract, Alice, MBloxContract, Recipient, gameWallet } =
      await loadFixture(deployFixture);

    const eu = ethers.utils;

    const data = eu.defaultAbiCoder.encode(
      ["address", "string"],
      [Alice.address, "dateTime1"]
    );

    const hash = eu.keccak256(data);

    const sig = await gameWallet.signMessage(eu.arrayify(hash));

    await expect(
      GameManagerContract.convertMATICtoMBLOX(Alice.address, "dateTime1", sig, {
        value: ethers.utils.parseEther("0.1"),
      })
    ).to.not.be.reverted;

    const aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq(ethers.utils.parseEther("1000"));

    const recipientBalance = await Recipient.getBalance();
    const recBalInEther = ethers.utils.formatUnits(
      recipientBalance.toString(),
      "ether"
    );

    // Test accounts start with 10000 test eth
    expect(recBalInEther).be.eq("10000.1");
  });
});
