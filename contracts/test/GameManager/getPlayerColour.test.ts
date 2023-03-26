import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("GameManager getPlayerColour tests", () => {
  /**
   * =====================================================================
   *   SHOULD RETURN EMPTY STRING FOR NO COLOUR
   * =====================================================================
   */
  it("Should return empty string for no colour", async () => {
    const { GameManagerContract, Alice } = await loadFixture(deployFixture);

    const playerColour = await GameManagerContract.getPlayerColour(
      Alice.address
    );

    expect(playerColour).be.eq("");
  });

  /**
   * =====================================================================
   *   SHOULD RETURN CORRECT COLOUR
   * =====================================================================
   */
  it("Should return correct colour", async () => {
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

    const playerColour = await GameManagerContract.getPlayerColour(
      Alice.address
    );

    expect(playerColour).be.eq("#fff000");
  });
});
