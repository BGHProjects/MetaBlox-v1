export const inputToImage: Record<string, string> = {
  dirt: "dirt.jpg",
  grass: "grass.jpg",
  glass: "glass.png",
  log: "log.jpg",
  wood: "wood.png",
  lava: "lava.jpg",
  gold: "gold.png",
  opal: "opal.png",
  amethyst: "amethyst.png",
  space: "space.png",
};

export enum GameState {
  Visiting = "Visiting",
  Building = "Building",
  Sandbox = "Sandbox",
  None = "None",
}
