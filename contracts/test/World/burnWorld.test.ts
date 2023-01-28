import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("World burnWorld tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ADDRESS WITHOUT CORRECT ROLE TO CALL FUNCTION
   * =====================================================================
   */
  it("Should not allow address without correct role to call function", async () => {
    const { WorldContract, Alice } = await loadFixture(deployFixture);

    await expect(WorldContract.connect(Alice).burnWorld(1)).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD BURN WORLD
   * =====================================================================
   */
  it("Should burn world", async () => {
    const { WorldContract, Alice, testWorld1 } = await loadFixture(
      deployFixture
    );

    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    let totalWorlds = await WorldContract._tokenIdCounter();
    let convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(1);

    await expect(WorldContract.burnWorld(0)).to.not.be.reverted;

    totalWorlds = await WorldContract._tokenIdCounter();
    convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(0);
  });
});
