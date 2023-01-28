import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BytesLike } from "ethers";
import { PromiseOrValue } from "../../typechain-types/common";
import deployFixture from "./deployFixture";

const ERC1155interfaceId = 0xd9b67a26;
const ERC721interfaceId = 0x80ac58cd;

describe("World supportsInterface tests", () => {
  /**
   * ===========================================================================
   *   SHOULD IDENTIFY THAT THIS CONTRACT DOESN'T SUPPORT THE ERC1155 INTERFACE
   * ===========================================================================
   */
  it("Should identify that this contract doesn't support the ERC1155 interface", async () => {
    const { WorldContract } = await loadFixture(deployFixture);

    expect(
      await WorldContract.supportsInterface(
        ERC1155interfaceId as unknown as PromiseOrValue<BytesLike>
      )
    ).be.eq(false);
  });

  /**
   * ==========================================================================
   *   SHOULD IDENTIFY THAT THIS CONTRACT SUPPORTS THE ERC721 INTERFACE
   * ==========================================================================
   */
  it("Should identify that this contract supports the ERC721 interface", async () => {
    const { WorldContract } = await loadFixture(deployFixture);

    expect(
      await WorldContract.supportsInterface(
        ERC721interfaceId as unknown as PromiseOrValue<BytesLike>
      )
    ).be.eq(true);
  });
});
