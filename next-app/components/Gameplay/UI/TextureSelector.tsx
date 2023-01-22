import { Center, chakra, Image, Text, HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import useKeyboard from "../../../hooks/useKeyboard";
import useStore from "../../../hooks/useStore";
import {
  dirtImg,
  grassImg,
  glassImg,
  woodImg,
  logImg,
  goldImg,
  opalImg,
  spaceinvadersImg,
  pacmanImg,
  labrykImg,
} from "../../../public/images/images";
import BlurBackground from "../../Menu/BlurBackground";

const images = {
  dirt: dirtImg,
  grass: grassImg,
  glass: glassImg,
  wood: woodImg,
  log: logImg,
  gold: goldImg,
  opal: opalImg,
  spaceinvaders: spaceinvadersImg,
  pacman: pacmanImg,
  labryk: labrykImg,
};

const normalSize = 30;
const selectedSize = 40;

const TextureSelector = () => {
  const [activeTexture, setTexture] = useStore((state) => [
    state.texture,
    state.setTexture,
  ]);

  const {
    dirt,
    grass,
    glass,
    wood,
    log,
    gold,
    opal,
    spaceinvaders,
    pacman,
    labryk,
  } = useKeyboard();

  useEffect(() => {
    const textures = {
      dirt,
      grass,
      glass,
      wood,
      log,
      gold,
      opal,
      spaceinvaders,
      pacman,
      labryk,
    };
    const pressedTexture = Object.entries(textures).find(([k, v]) => v);

    if (pressedTexture) {
      setTexture(pressedTexture[0]);
    }
  }, [
    setTexture,
    dirt,
    grass,
    glass,
    wood,
    log,
    gold,
    opal,
    spaceinvaders,
    pacman,
    labryk,
  ]);

  return (
    <SelectorContainer>
      <BlurBackground />
      <Center>
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
                a
                w={size}
                border={k === activeTexture ? "3px solid orange" : "none"}
              />
            </>
          );
        })}
      </Center>

      <HStack spacing={10} mt="5px" zIndex="1">
        <HelpText>Press C for Controls</HelpText>
        <HelpText>Press Q to Quit</HelpText>
      </HStack>
    </SelectorContainer>
  );
};

const HelpText = chakra(Text, {
  baseStyle: {
    color: "white",
  },
});

const SelectorContainer = chakra(Center, {
  baseStyle: {
    w: "fit-content",
    p: "10px",
    h: "fit-content",
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    m: "auto",
    borderRadius: "10px",
    flexDirection: "column",
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
