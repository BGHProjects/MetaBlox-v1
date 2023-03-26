import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager purchaseWorld tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE BY THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow purchase by the zero address", async () => {
    const { GameManagerContract, testWorld1, gameWallet } = await loadFixture(
      deployFixture
    );

    const eu = ethers.utils;

    const data = eu.defaultAbiCoder.encode(
      [
        "tuple(tuple(address owner, tuple(uint256 x, uint256 y) coords) worldGridData, tuple(uint256 blockTotal, string worldLayout) worldBlockDetails, string colour, uint256 id, string tokenURI)",
        "address",
        "string",
      ],
      [testWorld1, ZERO_ADDRESS, "dateTime"]
    );

    const hash = eu.keccak256(data);

    const sig = await gameWallet.signMessage(eu.arrayify(hash));

    await expect(
      GameManagerContract.purchaseWorld(
        testWorld1,
        ZERO_ADDRESS,
        "dateTime",
        sig
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITHOUT ADEQUATE MBLOX BALANCE
   * =====================================================================
   */
  it("Should not allow purchase without adequate MBLOX balance", async () => {
    const { GameManagerContract, Alice, testWorld1, gameWallet } =
      await loadFixture(deployFixture);

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
    ).to.be.revertedWithCustomError(GameManagerContract, "InadequateMBLOX");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITH AN INVALID SIGNATURE
   * =====================================================================
   */
  it("Should not allow purchase with an invalid signature", async () => {
    const {
      GameManagerContract,
      Alice,
      testWorld1,
      MBloxContract,
      invalidPBSignature,
    } = await loadFixture(deployFixture);

    await MBloxContract.mintMBlox(
      Alice.address,
      ethers.utils.parseEther("150")
    );

    await expect(
      GameManagerContract.purchaseWorld(
        testWorld1,
        Alice.address,
        "dateTime",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidSignature");
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

    const worldBalance = await WorldContract.balanceOf(Alice.address);
    expect(worldBalance).be.eq(1);

    const mbloxBalance = await MBloxContract.balanceOf(Alice.address);
    expect(mbloxBalance).be.eq(ethers.utils.parseEther("50"));

    const gridData = await GameManagerContract.getGridData();
    expect(gridData.length).be.eq(1);
  });
});
