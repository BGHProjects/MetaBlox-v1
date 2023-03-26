import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import {
  BURNER_ROLE,
  MINTER_ROLE,
  URI_SETTER_ROLE,
  DEFAULT_ADMIN_ROLE,
} from "../../constants/roles";
import deployFixture from "./deployFixture";

describe("MetaBlox initialize tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW RE-INITIALIZING
   * =====================================================================
   */
  it("Should not allow re-initializing", async () => {
    const { MetaBloxContract, gameWallet } = await loadFixture(deployFixture);

    await expect(MetaBloxContract.initialize(gameWallet.address)).to.be
      .reverted;
  });

  /**
   * =====================================================================
   *   SHOULD CORRECTLY GRANT ROLES
   * =====================================================================
   */
  it("Should correctly grant roles", async () => {
    const { MetaBloxContract, Deployer } = await loadFixture(deployFixture);

    expect(
      await MetaBloxContract.hasRole(DEFAULT_ADMIN_ROLE, Deployer.address)
    ).to.eq(true);
    expect(await MetaBloxContract.hasRole(MINTER_ROLE, Deployer.address)).to.eq(
      true
    );
    expect(await MetaBloxContract.hasRole(BURNER_ROLE, Deployer.address)).to.eq(
      true
    );
    expect(
      await MetaBloxContract.hasRole(URI_SETTER_ROLE, Deployer.address)
    ).to.eq(true);
  });
});
