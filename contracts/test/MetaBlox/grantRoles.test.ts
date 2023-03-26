import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  BURNER_ROLE,
  MINTER_ROLE,
  URI_SETTER_ROLE,
} from "../../constants/roles";

import deployFixture from "./deployFixture";

describe("MetaBlox grantRoles tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW GRANTING ROLES TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow granting roles to the zero address", async () => {
    const { MetaBloxContract, invalidSignature } = await loadFixture(
      deployFixture
    );

    await expect(
      MetaBloxContract.grantRoles(
        ethers.constants.AddressZero,
        invalidSignature
      )
    ).to.be.revertedWithCustomError(MetaBloxContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW GRANTING ROLES WITH AN INVALID SIGNATURE
   * =====================================================================
   */
  it("Should not allow granting roles with an invalid signature", async () => {
    const { MetaBloxContract, Alice, invalidSignature } = await loadFixture(
      deployFixture
    );

    await expect(
      MetaBloxContract.grantRoles(Alice.address, invalidSignature)
    ).to.be.revertedWithCustomError(MetaBloxContract, "InvalidSignature");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW GRANTING OF ROLES
   * =====================================================================
   */
  it("Should allow granting of roles", async () => {
    const { MetaBloxContract, Alice, validSignature } = await loadFixture(
      deployFixture
    );

    await expect(MetaBloxContract.grantRoles(Alice.address, validSignature)).not
      .be.reverted;

    expect(await MetaBloxContract.hasRole(MINTER_ROLE, Alice.address)).to.eq(
      true
    );
    expect(await MetaBloxContract.hasRole(BURNER_ROLE, Alice.address)).to.eq(
      true
    );
    expect(
      await MetaBloxContract.hasRole(URI_SETTER_ROLE, Alice.address)
    ).to.eq(true);
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW SAME SIGNATURE
   * =====================================================================
   */
  it("Should not allow same signature", async () => {
    const { MetaBloxContract, Alice, validSignature } = await loadFixture(
      deployFixture
    );

    await expect(MetaBloxContract.grantRoles(Alice.address, validSignature)).not
      .be.reverted;

    await expect(
      MetaBloxContract.grantRoles(Alice.address, validSignature)
    ).to.be.revertedWithCustomError(MetaBloxContract, "InvalidSignature");
  });
});
