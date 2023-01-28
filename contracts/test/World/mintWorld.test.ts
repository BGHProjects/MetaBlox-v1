import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("World mintWorld tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ADDRESS WITHOUT CORRECT ROLE TO CALL FUNCTION
   * =====================================================================
   */
  it("Should not allow address without correct role to call function", async () => {
    const { WorldContract, Alice, Bob, testWorld1 } = await loadFixture(
      deployFixture
    );

    await expect(
      WorldContract.connect(Alice).mintWorld(Bob.address, testWorld1)
    ).to.be.reverted;
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW MINTING TO THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow minting to the zero address", async () => {
    const { WorldContract, testWorld1 } = await loadFixture(deployFixture);

    await expect(
      WorldContract.mintWorld(ZERO_ADDRESS, testWorld1)
    ).to.be.revertedWithCustomError(WorldContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW ZERO ADDRESS TO BE THE OWNER OF A NEW WORLD
   * =====================================================================
   */
  it("Should not allow zero address to be the owner of a new World", async () => {
    const { WorldContract, zeroAddressWorld, Alice } = await loadFixture(
      deployFixture
    );

    await expect(
      WorldContract.mintWorld(Alice.address, zeroAddressWorld)
    ).to.be.revertedWithCustomError(WorldContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD MINT WORLDS
   * =====================================================================
   */
  it("Should mint tokens", async () => {
    const { WorldContract, Alice, testWorld1, testWorld2 } = await loadFixture(
      deployFixture
    );

    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    let totalWorlds = await WorldContract._tokenIdCounter();
    let convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(1);

    await expect(WorldContract.mintWorld(Alice.address, testWorld2)).to.not.be
      .reverted;

    totalWorlds = await WorldContract._tokenIdCounter();
    convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(2);
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW MINTING AT SAME GRID LOCATION
   * =====================================================================
   */
  it("Should not allow minting at same grid location", async () => {
    const { WorldContract, Alice, testWorld1 } = await loadFixture(
      deployFixture
    );

    await expect(WorldContract.mintWorld(Alice.address, testWorld1)).to.not.be
      .reverted;

    let totalWorlds = await WorldContract._tokenIdCounter();
    let convertToInt = Number(ethers.utils.formatEther(totalWorlds)) * 10 ** 18;

    expect(convertToInt).to.eq(1);

    await expect(
      WorldContract.mintWorld(Alice.address, testWorld1)
    ).to.be.revertedWithCustomError(WorldContract, "AlreadyOnGrid");
  });
});
