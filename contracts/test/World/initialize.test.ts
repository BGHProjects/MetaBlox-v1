import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import {
  BURNER_ROLE,
  MINTER_ROLE,
  DEFAULT_ADMIN_ROLE,
  UPDATER_ROLE,
} from "../../constants/roles";
import deployFixture from "./deployFixture";

describe("World initialize tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW RE-INITIALIZING
   * =====================================================================
   */
  it("Should not allow re-initializing", async () => {
    const { WorldContract, gameWallet } = await loadFixture(deployFixture);

    await expect(WorldContract.initialize(gameWallet.address)).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD CORRECTLY GRANT ROLES
   * =====================================================================
   */
  it("Should correctly grant roles", async () => {
    const { WorldContract, Deployer } = await loadFixture(deployFixture);

    expect(
      await WorldContract.hasRole(DEFAULT_ADMIN_ROLE, Deployer.address)
    ).to.eq(true);
    expect(await WorldContract.hasRole(MINTER_ROLE, Deployer.address)).to.eq(
      true
    );
    expect(await WorldContract.hasRole(BURNER_ROLE, Deployer.address)).to.eq(
      true
    );
    expect(await WorldContract.hasRole(UPDATER_ROLE, Deployer.address)).to.eq(
      true
    );
  });
});
