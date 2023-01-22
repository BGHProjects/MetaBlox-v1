enum Block {
  Dirt = "DIRT",
  Grass = "GRASS",
  Wood = "WOOD",
  Log = "LOG",
  Glass = "GLASS",
  Gold = "GOLD",
  Opal = "OPAL",
  SpaceInvaders = "SPACEINVADERS",
  PacMan = "PACMAN",
  Labryk = "LABRYK",
}

const blockToImage: Record<Block, string> = {
  [Block.Grass]: "grass.jpg",
  [Block.Wood]: "wood.png",
  [Block.Log]: "log.jpg",
  [Block.Dirt]: "dirt.jpg",
  [Block.Glass]: "glass.png",
  [Block.Gold]: "gold.png",
  [Block.Opal]: "opal.png",
  [Block.SpaceInvaders]: "spaceinvaders.jpg",
  [Block.PacMan]: "pacman.gif",
  [Block.Labryk]: "labrys.png",
};

const blockPrices: Record<Block, number> = {
  [Block.Glass]: 15,
  [Block.Glass]: 15,
  [Block.Grass]: 10,
  [Block.Wood]: 10,
  [Block.Log]: 10,
  [Block.Dirt]: 10,
  [Block.Gold]: 15,
  [Block.Opal]: 15,
  [Block.SpaceInvaders]: 15,
  [Block.PacMan]: 15,
  [Block.Labryk]: 20,
};

export { Block, blockToImage, blockPrices };
