import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager purchaseWorld tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITH AN INVALID DIGITAL KEY
   * =====================================================================
   */
  it("Should not allow purchase with an invalid digital key", async () => {
    const { GameManagerContract, Alice, testWorld1 } = await loadFixture(
      deployFixture
    );
    await expect(
      GameManagerContract.purchaseWorld(
        "notTestDigitalKey",
        testWorld1,
        Alice.address
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidDigitalKey");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE BY THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow purchase by the zero address", async () => {
    const { GameManagerContract, testWorld1 } = await loadFixture(
      deployFixture
    );
    await expect(
      GameManagerContract.purchaseWorld(
        "testDigitalKey",
        testWorld1,
        ZERO_ADDRESS
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITHOUT ADEQUATE MBLOX BALANCE
   * =====================================================================
   */
  it("Should not allow purchase without adequate MBLOX balance", async () => {
    const { GameManagerContract, Alice, testWorld1 } = await loadFixture(
      deployFixture
    );
    await expect(
      GameManagerContract.purchaseWorld(
        "testDigitalKey",
        testWorld1,
        Alice.address
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InadequateMBLOX");
  });

  /**
   * =====================================================================
   *   SHOULD ALLOW PURCHASE
   * =====================================================================
   */
  it("Should allow purchase", async () => {
    const {
      GameManagerContract,
      Alice,
      testWorld1,
      MBloxContract,
      WorldContract,
    } = await loadFixture(deployFixture);

    await MBloxContract.mintMBlox(Alice.address, 150);

    await expect(
      GameManagerContract.purchaseWorld(
        "testDigitalKey",
        testWorld1,
        Alice.address
      )
    ).to.not.be.reverted;

    const worldBalance = await WorldContract.balanceOf(Alice.address);
    expect(worldBalance).be.eq(1);

    const mbloxBalance = await MBloxContract.balanceOf(Alice.address);
    expect(mbloxBalance).be.eq(50);

    const gridData = await GameManagerContract.getGridData();
    expect(gridData.length).be.eq(1);
  });
});
