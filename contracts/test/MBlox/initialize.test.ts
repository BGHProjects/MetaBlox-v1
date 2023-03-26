import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import {
  BURNER_ROLE,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
} from "../../constants/roles";
import deployFixture from "./deployFixture";

describe("MBlox initialize tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW RE-INITIALIZING
   * =====================================================================
   */
  it("Should not allow re-initializing", async () => {
    const { MBloxContract, gameWallet } = await loadFixture(deployFixture);

    await expect(MBloxContract.initialize(gameWallet.address)).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD CORRECTLY GRANT ROLES
   * =====================================================================
   */
  it("Should correctly grant roles", async () => {
    const { MBloxContract, Deployer } = await loadFixture(deployFixture);

    expect(
      await MBloxContract.hasRole(DEFAULT_ADMIN_ROLE, Deployer.address)
    ).to.eq(true);
    expect(await MBloxContract.hasRole(MINTER_ROLE, Deployer.address)).to.eq(
      true
    );
    expect(await MBloxContract.hasRole(BURNER_ROLE, Deployer.address)).to.eq(
      true
    );
  });
});
