import { ethers } from "ethers";

export const ZERO_ADDRESS = ethers.constants.AddressZero;

export const testWorld1 = {
  worldGridData: {
    owner: "0xd5e099c71b797516c10ed0f0d895f429c2781142",
    coords: {
      x: 1,
      y: 2,
    },
  },
  worldBlockDetails: {
    blockTotal: 5,
    worldLayout: "testWorldLayout1",
  },
  colour: "#fff000",
  id: 0,
  tokenURI: "ipfs://tokenURI",
};

export const testWorld2 = {
  worldGridData: {
    owner: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    coords: {
      x: 3,
      y: 4,
    },
  },
  worldBlockDetails: {
    blockTotal: 6,
    worldLayout: "testWorldLayout2",
  },
  colour: "#fff000",
  id: 0,
  tokenURI: "ipfs://tokenURI",
};

export const zeroAddressWorld = {
  worldGridData: {
    owner: ZERO_ADDRESS,
    coords: {
      x: 3,
      y: 4,
    },
  },
  worldBlockDetails: {
    blockTotal: 6,
    worldLayout: "testWorldLayout2",
  },
  colour: "#fff000",
  id: 0,
  tokenURI: "ipfs://tokenURI",
};

export const updatedWorldBlockDetails = {
  blockTotal: 10,
  worldLayout: "updatedWorldLayout",
};

export const testBlockUpdates = {
  increases: [2, 3],
  increaseIds: [0, 1],
  decreases: [1, 4],
  decreaseIds: [2, 3],
};

export const emptyBlockUpdates = {
  increases: [],
  increaseIds: [],
  decreases: [],
  decreaseIds: [],
};
