const { ethers, upgrades } = require("hardhat");

const digitalKey = "testDigitalKey"; // Change this when actually deploying to env variable
const METRAddress = "0x22ac36f2932c73559df2b288a375e12c8fa9b7db"; // Also maybe save this to env

async function main() {
  // =======================
  //  DEPLOY MBLOX
  // =======================

  console.log("\n\tBeginning to deploy the MBlox contract...");
  const MBlox_Contract = await ethers.getContractFactory("MBlox");
  const MBloxContract = await upgrades.deployProxy(MBlox_Contract, [
    digitalKey,
  ]);
  await MBloxContract.deployed();
  console.log("\n\tMBlox deployed: ", MBloxContract.address);

  // =======================
  //  DEPLOY METABLOX
  // =======================

  console.log("\n\tBeginning to deploy the MetaBlox contract...");
  const MetaBlox_Contract = await ethers.getContractFactory("MetaBlox");
  const MetaBloxContract = await upgrades.deployProxy(MetaBlox_Contract, [
    digitalKey,
  ]);
  await MetaBloxContract.deployed();
  console.log("\n\tMetaBlox deployed: ", MetaBloxContract.address);

  // =======================
  //  DEPLOY WORLD
  // =======================

  console.log("\n\tBeginning to deploy the World contract...");
  const World_Contract = await ethers.getContractFactory("World");
  const WorldContract = await upgrades.deployProxy(World_Contract, [
    digitalKey,
  ]);
  await WorldContract.deployed();
  console.log("\n\tWorld deployed: ", WorldContract.address);

  // =======================
  //  DEPLOY GAME MANAGER
  // =======================

  console.log("\n\tBeginning to deploy the Game Manager contract...");
  const GameManager_Contract = await ethers.getContractFactory("GameManager");
  const GameManagerContract = await upgrades.deployProxy(GameManager_Contract, [
    digitalKey,
    METRAddress,
    MBloxContract.address,
    MetaBloxContract.address,
    WorldContract.address,
    process.env.PUBLIC_KEY,
  ]);
  await GameManagerContract.deployed();
  console.log("\n\tGame Manager deployed: ", GameManagerContract.address);

  // ==========================
  //  GRANT GAME MANAGER ROLES
  // ==========================

  console.log("\n\tGranting roles to other contracts...");
  await MBloxContract.grantRoles(GameManagerContract.address, digitalKey);
  await MetaBloxContract.grantRoles(GameManagerContract.address, digitalKey);
  await WorldContract.grantRoles(GameManagerContract.address, digitalKey);
  console.log("\n\tRoles granted");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
