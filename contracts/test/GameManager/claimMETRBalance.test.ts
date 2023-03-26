import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager claimMETRBalance tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CLAIMING BY THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow claiming by the zero address", async () => {
    const { GameManagerContract, invalidPBSignature } = await loadFixture(
      deployFixture
    );
    await expect(
      GameManagerContract.claimMETRBalance(
        ZERO_ADDRESS,
        "dateTime",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CLAIMING IF THE USER HAS NO METR TO CLAIM
   * =====================================================================
   */
  it("Should not allow claiming if the user has not METR to claim", async () => {
    const { GameManagerContract, Alice, invalidPBSignature } =
      await loadFixture(deployFixture);
    await expect(
      GameManagerContract.claimMETRBalance(
        Alice.address,
        "dateTime",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "NoMETRToClaim");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW CLAIMING WITH AN INVALID SIGNATURE
   * =====================================================================
   */
  it("Should not allow claiming with an invalid signature", async () => {
    const { GameManagerContract, Alice, TestMETRContract, invalidPBSignature } =
      await loadFixture(deployFixture);

    await TestMETRContract.mintMBlox(Alice.address, 5);

    await expect(
      GameManagerContract.claimMETRBalance(
        Alice.address,
        "dateTime",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidSignature");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW CLAIMING METR
   * =====================================================================
   */
  it("Should allow claiming METR", async () => {
    const {
      GameManagerContract,
      Alice,
      TestMETRContract,
      MBloxContract,
      gameWallet,
    } = await loadFixture(deployFixture);

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

    const aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("5");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SUBSEQUENT CLAIM WITH SAME SIGNATURE
   * =====================================================================
   */
  it("Should not allow subsequent claim with same signature", async () => {
    const {
      GameManagerContract,
      Alice,
      TestMETRContract,
      MBloxContract,
      gameWallet,
    } = await loadFixture(deployFixture);

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

    const aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("5");

    await TestMETRContract.mintMBlox(Alice.address, 5);

    await expect(
      GameManagerContract.claimMETRBalance(Alice.address, "dateTime1", sig)
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidSignature");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOWING SUBSEQUENT CLAIM FOR CORRECT AMOUNT
   * =====================================================================
   */
  it("Should allow subsequent claim for correct amount", async () => {
    const {
      GameManagerContract,
      Alice,
      TestMETRContract,
      MBloxContract,
      gameWallet,
    } = await loadFixture(deployFixture);

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

    let aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("5");

    await TestMETRContract.mintMBlox(Alice.address, 1);

    const data2 = eu.defaultAbiCoder.encode(
      ["address", "string"],
      [Alice.address, "dateTime2"]
    );

    const hash2 = eu.keccak256(data2);

    const sig2 = await gameWallet.signMessage(eu.arrayify(hash2));

    await expect(
      GameManagerContract.claimMETRBalance(Alice.address, "dateTime2", sig2)
    ).to.not.be.reverted;

    aliceBalance = await MBloxContract.balanceOf(Alice.address);
    expect(aliceBalance.toString()).be.eq("6");
  });
});
