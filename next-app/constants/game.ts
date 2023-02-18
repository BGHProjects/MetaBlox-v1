export const inputToImage: Record<string, string> = {
  dirt: "dirt.jpg",
  grass: "grass.jpg",
  log: "log.jpg",
  wood: "wood.png",
  glass: "glass.png",
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
