import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("MBlox initializer tests", () => {
  it("Should not allow re-initializing", async () => {
    const { MBloxContract } = await loadFixture(deployFixture);

    await expect(MBloxContract.initialize("testDigitalKey")).to.be.reverted;
  });
});
