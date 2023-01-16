enum Block {
  Glass = "GLASS",
  Grass = "GRASS",
  Wood = "WOOD",
  Log = "LOG",
  Dirt = "DIRT",
}

const blockToImage: Record<Block, string> = {
  [Block.Glass]: "glass.png",
  [Block.Grass]: "grass.jpg",
  [Block.Wood]: "wood.png",
  [Block.Log]: "log.jpg",
  [Block.Dirt]: "dirt.jpg",
};

const blockPrices: Record<Block, number> = {
  [Block.Glass]: 15,
  [Block.Grass]: 10,
  [Block.Wood]: 10,
  [Block.Log]: 10,
  [Block.Dirt]: 10,
};

export { Block, blockToImage, blockPrices };
