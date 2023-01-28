import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BURNER_ROLE, MINTER_ROLE, UPDATER_ROLE } from "../../constants/roles";

import deployFixture from "./deployFixture";

describe("World grantRoles tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW GRANTING ROLES TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow granting roles to the zero address", async () => {
    const { WorldContract } = await loadFixture(deployFixture);

    await expect(
      WorldContract.grantRoles(ethers.constants.AddressZero, "testDigitalKey")
    ).to.be.revertedWithCustomError(WorldContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW GRANTING ROLES WITH AN INVALID DIGITAL KEY
   * =====================================================================
   */
  it("Should not allow granting roles with an invalid digital key", async () => {
    const { WorldContract, Alice } = await loadFixture(deployFixture);

    await expect(
      WorldContract.grantRoles(Alice.address, "notTestDigitalKey")
    ).to.be.revertedWithCustomError(WorldContract, "InvalidDigitalKey");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW GRANTING OF ROLES
   * =====================================================================
   */
  it("Should allow granting of roles", async () => {
    const { WorldContract, Alice } = await loadFixture(deployFixture);

    await expect(WorldContract.grantRoles(Alice.address, "testDigitalKey")).not
      .be.reverted;

    expect(await WorldContract.hasRole(MINTER_ROLE, Alice.address)).to.eq(true);
    expect(await WorldContract.hasRole(BURNER_ROLE, Alice.address)).to.eq(true);
    expect(await WorldContract.hasRole(UPDATER_ROLE, Alice.address)).to.eq(
      true
    );
  });
});
