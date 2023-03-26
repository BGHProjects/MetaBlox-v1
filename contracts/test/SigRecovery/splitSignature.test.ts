import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import deployFixture from "./deployFixture";

describe("SigRecovery splitSignature tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW INVALID SIGNATURE LENGTH
   * =====================================================================
   */

  it("Should not allow invalid signature length", async () => {
    const { MBloxContract, validMessageHash, Alice } = await loadFixture(
      deployFixture
    );

    await expect(MBloxContract.grantRoles(Alice.address, validMessageHash)).to
      .be.reverted;
  });
});
