import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

import deployFixture from "./deployFixture";

describe("MBlox burnMBlox tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ADDRESS WITHOUT CORRECT ROLE TO CALL FUNCTION
   * =====================================================================
   */
  it("Should not allow address without correct role to call function", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(MBloxContract.connect(Alice).burnMBlox(Alice.address, 1)).to.be
      .reverted;
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW BURNING FROM THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow burning from the zero address", async () => {
    const { MBloxContract } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.burnMBlox(ethers.constants.AddressZero, 1)
    ).to.be.revertedWithCustomError(MBloxContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW BURNING AN AMOUNT LESS THAN ONE
   * =====================================================================
   */
  it("Should not allow burning an amount less than one", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.burnMBlox(Alice.address, 0)
    ).to.be.revertedWithCustomError(MBloxContract, "NotPositiveValue");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW A VALID BURN FUNCTION CALL
   * =====================================================================
   */
  it("Should allow a valid burn function call", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(MBloxContract.mintMBlox(Alice.address, parseEther("2"))).not.be
      .reverted;

    expect(await MBloxContract.balanceOf(Alice.address)).to.equal(
      parseEther("2")
    );

    await expect(MBloxContract.burnMBlox(Alice.address, parseEther("1"))).not.be
      .reverted;

    expect(await MBloxContract.balanceOf(Alice.address)).to.equal(
      parseEther("1")
    );
  });
});
