import create from "zustand";
import { nanoid } from "nanoid";
import { ICube } from "../interfaces/cube";

const useStore = create((set) => ({
  texture: "dirt",
  cubes: [],
  addCube: (x: number, y: number, z: number) => {
    set((prev: any) => ({
      cubes: [
        ...prev.cubes,
        {
          key: nanoid(),
          pos: [x, y, z],
          texture: prev.texture,
        },
      ],
    }));
  },
  removeCube: (x: number, y: number, z: number) => {
    set((prev: any) => ({
      cubes: prev.cubes.filter((cube: ICube) => {
        const [X, Y, Z] = cube.pos;
        return X !== x || Y !== y || Z !== z;
      }),
    }));
  },
  setTexture: (texture: string) => {
    set(() => ({
      texture,
    }));
  },
  saveWorld: () => {},
  resetWorld: () => {
    set(() => ({
      cubes: [],
    }));
  },
  setCubes: (inputCubes: []) => {
    set(() => ({
      cubes: inputCubes,
    }));
  },
}));

export default useStore;
