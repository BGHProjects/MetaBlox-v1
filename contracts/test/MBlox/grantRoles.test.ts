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
    const { MBloxContract, invalidSignature } = await loadFixture(
      deployFixture
    );

    await expect(
      MBloxContract.grantRoles(ethers.constants.AddressZero, invalidSignature)
    ).to.be.revertedWithCustomError(MBloxContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW GRANTING ROLES WITH AN INVALID SIGNATURE
   * =====================================================================
   */
  it("Should not allow granting roles with an invalid signature", async () => {
    const { MBloxContract, Alice, invalidSignature } = await loadFixture(
      deployFixture
    );

    await expect(
      MBloxContract.grantRoles(Alice.address, invalidSignature)
    ).to.be.revertedWithCustomError(MBloxContract, "InvalidSignature");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW GRANTING OF ROLES
   * =====================================================================
   */
  it("Should allow granting of roles", async () => {
    const { MBloxContract, Alice, validSignature } = await loadFixture(
      deployFixture
    );

    await expect(MBloxContract.grantRoles(Alice.address, validSignature)).not.be
      .reverted;

    expect(await MBloxContract.hasRole(MINTER_ROLE, Alice.address)).to.eq(true);
    expect(await MBloxContract.hasRole(BURNER_ROLE, Alice.address)).to.eq(true);
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SAME SIGNATURE
   * =====================================================================
   */
  it("Should not allow same signature", async () => {
    const { MBloxContract, Alice, validSignature } = await loadFixture(
      deployFixture
    );

    await expect(MBloxContract.grantRoles(Alice.address, validSignature)).not.be
      .reverted;

    await expect(
      MBloxContract.grantRoles(Alice.address, validSignature)
    ).to.be.revertedWithCustomError(MBloxContract, "InvalidSignature");
  });
});
