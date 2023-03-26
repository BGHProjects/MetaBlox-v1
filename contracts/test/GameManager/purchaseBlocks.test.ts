import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZERO_ADDRESS } from "../../constants/testHelpers";
import deployFixture from "./deployFixture";

describe("GameManager purchaseBlocks tests", () => {
  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITH AN INVALID SIGNATURE
   * =====================================================================
   */
  it("Should not allow purchase with an invalid signature", async () => {
    const { GameManagerContract, Alice, invalidPBSignature } =
      await loadFixture(deployFixture);
    await expect(
      GameManagerContract.purchaseBlocks(
        1,
        1,
        Alice.address,
        "dateTime1",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidSignature");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE BY THE ZERO ADDRESS
   * =====================================================================
   */
  it("Should not allow purchase by the zero address", async () => {
    const { GameManagerContract, invalidPBSignature } = await loadFixture(
      deployFixture
    );
    await expect(
      GameManagerContract.purchaseBlocks(
        1,
        1,
        ZERO_ADDRESS,
        "dateTime1",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "ZeroAddress");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITH A NON-POSITIVE AMOUNT
   * =====================================================================
   */
  it("Should not allow purchase with a non-positive amount", async () => {
    const { GameManagerContract, Alice, invalidPBSignature } =
      await loadFixture(deployFixture);
    await expect(
      GameManagerContract.purchaseBlocks(
        1,
        0,
        Alice.address,
        "dateTime1",
        invalidPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "NotPositiveValue");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE OF INVALID BLOCK TYPE
   * =====================================================================
   */
  it("Should not allow purchase of invalid block type", async () => {
    const { GameManagerContract, Alice, gameWallet } = await loadFixture(
      deployFixture
    );

    const validPBHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "address", "bytes"],
        [
          13,
          1,
          Alice.address,
          ethers.utils.formatBytes32String("dateTime1").substring(0, 20),
        ]
      )
    );

    const validPBSig = await gameWallet.signMessage(
      ethers.utils.arrayify(validPBHash)
    );
    const validPBSignature = ethers.utils.arrayify(validPBSig);

    await expect(
      GameManagerContract.purchaseBlocks(
        13,
        1,
        Alice.address,
        "dateTime1",
        validPBSignature
      )
    ).to.be.revertedWithCustomError(GameManagerContract, "InvalidTokenID");
  });

  /**
   * =====================================================================
   *   SHOULD NOT ALLOW PURCHASE WITHOUT ADEQUATE MBLOX BALANCE
   * =====================================================================
   */
  it("Should not allow purchase without adequate MBLOX balance", async () => {
    const { GameManagerContract, Alice, gameWallet } = await loadFixture(
      deployFixture
    );

    const validPBHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "address", "bytes"],
        [
          1,
          1,
          Alice.address,
          ethers.utils.formatBytes32String("dateTime1").substring(0, 20),
        ]
      )
    );

    const validPBSig = await gameWallet.signMessage(
      ethers.utils.arrayify(validPBHash)
    );
    const validPBSignature = ethers.utils.arrayify(validPBSig);

    await expect(
      GameManagerContract.purchaseBlocks(
        1,
        1,
        Alice.address,
        "dateTime1",
        validPBSignature
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
      MBloxContract,
      MetaBloxContract,
      gameWallet,
    } = await loadFixture(deployFixture);

    await MBloxContract.mintMBlox(
      Alice.address,
      ethers.utils.parseEther("100")
    );

    const validPBHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "address", "bytes"],
        [
          1,
          1,
          Alice.address,
          ethers.utils.formatBytes32String("dateTime1").substring(0, 20),
        ]
      )
    );

    const validPBSig = await gameWallet.signMessage(
      ethers.utils.arrayify(validPBHash)
    );
    const validPBSignature = ethers.utils.arrayify(validPBSig);

    await expect(
      GameManagerContract.purchaseBlocks(
        1,
        1,
        Alice.address,
        "dateTime1",
        validPBSignature
      )
    ).to.not.be.reverted;

    const mbloxBalance = await MBloxContract.balanceOf(Alice.address);
    expect(mbloxBalance).be.eq(ethers.utils.parseEther("90"));

    const type1Balance = await MetaBloxContract.balanceOf(Alice.address, 1);
    expect(type1Balance).be.eq(1);
  });
});
