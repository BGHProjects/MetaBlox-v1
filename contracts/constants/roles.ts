import { ethers } from "ethers";

export const generateRole = (role: string) =>
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes(role));

export const DEFAULT_ADMIN_ROLE = ethers.utils.hexZeroPad("0x00", 32);
export const MINTER_ROLE = generateRole("MINTER_ROLE");
export const BURNER_ROLE = generateRole("BURNER_ROLE");
export const URI_SETTER_ROLE = generateRole("URI_SETTER_ROLE");
export const UPDATER_ROLE = generateRole("UPDATER_ROLE");
