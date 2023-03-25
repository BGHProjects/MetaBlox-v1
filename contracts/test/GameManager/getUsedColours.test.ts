import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("GameManager getUsedColours tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN EMPTY ARRAY FOR NO COLOURS
   * =====================================================================
   */
  it("Should return empty array for no colours", async () => {
    const { GameManagerContract } = await loadFixture(deployFixture);

    const usedColours = await GameManagerContract.getUsedColours();

    expect(usedColours.length).be.eq(0);
  });

  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT ARRAY
   * =====================================================================
   */
  it("Should return correct array", async () => {
    const {
      GameManagerContract,
      MBloxContract,
      Alice,
      testWorld1,
      gameWallet,
    } = await loadFixture(deployFixture);

    await MBloxContract.mintMBlox(
      Alice.address,
      ethers.utils.parseEther("150")
    );

    const eu = ethers.utils;

    const data = eu.defaultAbiCoder.encode(
      [
        "tuple(tuple(address owner, tuple(uint256 x, uint256 y) coords) worldGridData, tuple(uint256 blockTotal, string worldLayout) worldBlockDetails, string colour, uint256 id, string tokenURI)",
        "address",
        "string",
      ],
      [testWorld1, Alice.address, "dateTime"]
    );

    const hash = eu.keccak256(data);

    const sig = await gameWallet.signMessage(eu.arrayify(hash));

    await expect(
      GameManagerContract.purchaseWorld(
        testWorld1,
        Alice.address,
        "dateTime",
        sig
      )
    ).to.not.be.reverted;

    const usedColours = await GameManagerContract.getUsedColours();

    expect(usedColours.length).be.eq(1);
    expect(usedColours[0]).be.eq("#fff000");
  });
});
