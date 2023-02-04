enum Block {
  Dirt = "DIRT",
  Grass = "GRASS",
  Wood = "WOOD",
  Log = "LOG",
  Glass = "GLASS",
  Lava = "LAVA",
  Gold = "GOLD",
  Opal = "OPAL",
  Amethyst = "AMETHYST",
  Space = "SPACE",
}

const blockToImage: Record<Block, string> = {
  [Block.Grass]: "grass.jpg",
  [Block.Wood]: "wood.png",
  [Block.Log]: "log.jpg",
  [Block.Dirt]: "dirt.jpg",
  [Block.Glass]: "glass.png",
  [Block.Lava]: "lava.jpg",
  [Block.Gold]: "gold.png",
  [Block.Opal]: "opal.png",
  [Block.Amethyst]: "amethyst.png",
  [Block.Space]: "space.png",
};

const blockPrices: Record<Block, number> = {
  [Block.Grass]: 10,
  [Block.Wood]: 10,
  [Block.Log]: 10,
  [Block.Dirt]: 10,
  [Block.Glass]: 15,
  [Block.Lava]: 15,
  [Block.Gold]: 15,
  [Block.Opal]: 15,
  [Block.Amethyst]: 15,
  [Block.Space]: 20,
};

export { Block, blockToImage, blockPrices };
