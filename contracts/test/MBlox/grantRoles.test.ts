import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import deployFixture from "./deployFixture";

describe("MBlox grantRoles tests", () => {
  it("Should not allow granting roles to the zero address", async () => {
    const { MBloxContract } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.grantRoles(ethers.constants.AddressZero, "testDigitalKey")
    ).to.be.revertedWithCustomError(MBloxContract, "ZeroAddress");
  });

  it("Should not allow granting roles with an invalid digital key", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.grantRoles(Alice.address, "notTestDigitalKey")
    ).to.be.revertedWithCustomError(MBloxContract, "InvalidDigitalKey");
  });

  it("Should allow granting of roles", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(MBloxContract.grantRoles(Alice.address, "testDigitalKey")).not
      .be.reverted;
  });
});
