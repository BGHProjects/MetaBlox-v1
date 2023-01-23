import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

import deployFixture from "./deployFixture";

describe("MBlox burnMBlox tests", () => {
  it("Should not allow address without correct role to call function", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.connect(Alice).burnMBlox(Alice.address, 1, "testDigitalKey")
    ).to.be.reverted;
  });

  it("Should not allow burning from the zero address", async () => {
    const { MBloxContract } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.burnMBlox(ethers.constants.AddressZero, 1, "testDigitalKey")
    ).to.be.revertedWithCustomError(MBloxContract, "ZeroAddress");
  });

  it("Should not allow burning an amount less than one", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.burnMBlox(Alice.address, 0, "testDigitalKey")
    ).to.be.revertedWithCustomError(MBloxContract, "NotPositiveValue");
  });

  it("Should not allow burning with an invalid digital key", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.burnMBlox(Alice.address, 1, "notTestDigitalKey")
    ).to.be.revertedWithCustomError(MBloxContract, "InvalidDigitalKey");
  });

  it("Should allow a valid burn function call", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.mintMBlox(Alice.address, parseEther("2"), "testDigitalKey")
    ).not.be.reverted;

    expect(await MBloxContract.balanceOf(Alice.address)).to.equal(
      parseEther("2")
    );

    await expect(
      MBloxContract.burnMBlox(Alice.address, parseEther("1"), "testDigitalKey")
    ).not.be.reverted;

    expect(await MBloxContract.balanceOf(Alice.address)).to.equal(
      parseEther("1")
    );
  });
});
