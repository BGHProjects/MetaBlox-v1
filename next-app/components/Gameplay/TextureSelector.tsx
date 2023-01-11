import { Center, chakra, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useKeyboard from "../../hooks/useKeyboard";
import useStore from "../../hooks/useStore";
import {
  dirtImg,
  grassImg,
  glassImg,
  woodImg,
  logImg,
} from "../../public/images/images";
import BlurBackground from "../Menu/BlurBackground";

const images = {
  dirt: dirtImg,
  grass: grassImg,
  glass: glassImg,
  wood: woodImg,
  log: logImg,
};

const normalSize = 50;
const selectedSize = 70;

const TextureSelector = () => {
  const [visible, setVisible] = useState(false);
  const [activeTexture, setTexture] = useStore((state) => [
    state.texture,
    state.setTexture,
  ]);
  const { dirt, grass, glass, wood, log } = useKeyboard();

  useEffect(() => {
    const textures = {
      dirt,
      grass,
      glass,
      wood,
      log,
    };
    const pressedTexture = Object.entries(textures).find(([k, v]) => v);
    if (pressedTexture) {
      setTexture(pressedTexture[0]);
    }
  }, [setTexture, dirt, grass, glass, wood, log]);

  useEffect(() => {
    const visibilityTimeout = setTimeout(() => {
      setVisible(false);
    }, 2000);
    setVisible(true);
    return () => {
      clearTimeout(visibilityTimeout);
    };
  }, [activeTexture]);

  return (
    visible && (
      <SelectorContainer>
        <BlurBackground />

        {Object.entries(images).map(([k, src]) => {
          const size =
            k === activeTexture ? `${selectedSize}px` : `${normalSize}px`;
          return (
            <>
              {/* @ts-ignore */}
              <TextureImg
                key={k}
                src={src.src}
                alt={k}
                h={size}
                w={size}
                border={k === activeTexture ? "3px solid orange" : "none"}
              />
            </>
          );
        })}
      </SelectorContainer>
    )
  );
};

const SelectorContainer = chakra(Center, {
  baseStyle: {
    w: "fit-content",
    p: "20px",
    h: "fit-content",
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    m: "auto",
    borderRadius: "10px",
  },
});

const TextureImg = chakra(Image, {
  baseStyle: {
    mx: "10px",
    borderRadius: "10px",
    zIndex: "1",
  },
});

export default TextureSelector;
