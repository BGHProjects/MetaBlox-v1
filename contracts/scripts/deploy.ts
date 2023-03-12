const { ethers, upgrades } = require("hardhat");
require("dotenv").config({ path: __dirname } + "/.env");

async function main() {
  const { DIGITAL_KEY, METR_ADDRESS } = process.env;

  if (!DIGITAL_KEY || !METR_ADDRESS) {
    console.log("\n\t Invalid Environment variables");
    return;
  }

  // =======================
  //  DEPLOY MBLOX
  // =======================

  console.log("\n\t =======================");
  console.log("\t  MBLOX");
  console.log("\t =======================");

  console.log("\n\tBeginning deployment of the MBlox contract...");
  const MBlox_Contract = await ethers.getContractFactory("MBlox");
  const MBloxContract = await upgrades.deployProxy(MBlox_Contract, [
    DIGITAL_KEY,
  ]);
  await MBloxContract.deployed();
  console.log("\n\tMBlox deployed: ", MBloxContract.address);

  // =======================
  //  DEPLOY METABLOX
  // =======================

  console.log("\n\t =======================");
  console.log("\t  METABLOX");
  console.log("\t =======================");

  console.log("\n\tBeginning deployment of the MetaBlox contract...");
  const MetaBlox_Contract = await ethers.getContractFactory("MetaBlox");
  const MetaBloxContract = await upgrades.deployProxy(MetaBlox_Contract, [
    DIGITAL_KEY,
  ]);
  await MetaBloxContract.deployed();
  console.log("\n\tMetaBlox deployed: ", MetaBloxContract.address);

  console.log("\n\tSetting MetaBlox metadata...");
  await MetaBloxContract.setURI(
    "ipfs://QmbfBoNrqhYUYgMkvyHChqeN672adnfGVUEj2VYJkwByK8/{id}.json"
  );
  console.log("\n\tMetaBlox metadata set: ", await MetaBloxContract.uri(0));

  // =======================
  //  DEPLOY WORLD
  // =======================

  console.log("\n\t =======================");
  console.log("\t  WORLD");
  console.log("\t =======================");

  console.log("\n\tBeginning deployment of the World contract...");
  const World_Contract = await ethers.getContractFactory("World");
  const WorldContract = await upgrades.deployProxy(World_Contract, [
    DIGITAL_KEY,
  ]);
  await WorldContract.deployed();
  console.log("\n\tWorld deployed: ", WorldContract.address);

  // =======================
  //  DEPLOY GAME MANAGER
  // =======================

  console.log("\n\t =======================");
  console.log("\t  GAME MANAGER");
  console.log("\t =======================");

  console.log("\n\tBeginning deployment of the Game Manager contract...");
  const GameManager_Contract = await ethers.getContractFactory("GameManager");
  const GameManagerContract = await upgrades.deployProxy(GameManager_Contract, [
    DIGITAL_KEY,
    METR_ADDRESS,
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
  await MBloxContract.grantRoles(GameManagerContract.address, DIGITAL_KEY);
  await MetaBloxContract.grantRoles(GameManagerContract.address, DIGITAL_KEY);
  await WorldContract.grantRoles(GameManagerContract.address, DIGITAL_KEY);
  console.log("\n\tRoles granted");

  console.log("\n\tMinting MBlox for testing...");
  await MBloxContract.mintMBlox(
    process.env.PUBLIC_KEY,
    ethers.utils.parseEther("100000")
  );
  console.log("\n\tMinted MBlox for testing");

  console.log("\n\t =======================");
  console.log("\t  DEPLOYMENT COMPLETED");
  console.log("\t =======================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
