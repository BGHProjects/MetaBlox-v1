import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BURNER_ROLE, MINTER_ROLE } from "../../constants/roles";

import deployFixture from "./deployFixture";

describe("MBlox grantRoles tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW GRANTING ROLES TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow granting roles to the zero address", async () => {
    const { MBloxContract } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.grantRoles(ethers.constants.AddressZero, "testDigitalKey")
    ).to.be.revertedWithCustomError(MBloxContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW GRANTING ROLES WITH AN INVALID DIGITAL KEY
   * =====================================================================
   */
  it("Should not allow granting roles with an invalid digital key", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(
      MBloxContract.grantRoles(Alice.address, "notTestDigitalKey")
    ).to.be.revertedWithCustomError(MBloxContract, "InvalidDigitalKey");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW GRANTING OF ROLES
   * =====================================================================
   */
  it("Should allow granting of roles", async () => {
    const { MBloxContract, Alice } = await loadFixture(deployFixture);

    await expect(MBloxContract.grantRoles(Alice.address, "testDigitalKey")).not
      .be.reverted;

    expect(await MBloxContract.hasRole(MINTER_ROLE, Alice.address)).to.eq(true);
    expect(await MBloxContract.hasRole(BURNER_ROLE, Alice.address)).to.eq(true);
  });
});
