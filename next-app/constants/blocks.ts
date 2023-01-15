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

export { Block, blockToImage };
