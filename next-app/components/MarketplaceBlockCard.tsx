import { Center, chakra, Flex, Text } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  Mesh,
  NearestFilter,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from "three";
import { Block, blockToImage } from "../constants/blocks";
import { mainBG } from "../constants/colours";
import getRandomNumber from "../helpers/getRandomNumber";
import { AnimatedDiv } from "./AnimatedComponents";

const ANIM_DURATION = 0.3;

interface IMarketplaceBlockCard {
  block: Block;
  handleClick: () => void;
}

const MarketplaceBlockCard = ({
  block,
  handleClick,
}: IMarketplaceBlockCard) => {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [justRendered, setJustRendered] = useState(true);
  const [activeTexture, setActiveTexture] = useState<Texture | undefined>(
    undefined
  );
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const randomSpin = getRandomNumber(3, 5) / 1000;
  let ySpin = randomSpin;
  let zSpin = randomSpin;

  const cubeRef = useRef<Mesh>();

  const handleEnter = () => {
    setJustRendered(false);
    setHovering(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!typeof document === undefined) return;
    setActiveTexture(() => {
      let newTexture = new TextureLoader().load(
        `images/${blockToImage[block]}`
      );
      newTexture.magFilter = NearestFilter;
      newTexture.wrapS = RepeatWrapping;
      newTexture.wrapT = RepeatWrapping;

      return newTexture;
    });
  }, []);

  useEffect(() => {
    let coinFlip1 = getRandomNumber(1, 2);
    let coinFlip2 = getRandomNumber(1, 2);

    if (coinFlip1 === 1) ySpin *= -1;
    if (coinFlip2 === 2) zSpin *= -1;

    setTimeout(() => {
      const interval = setInterval(() => {
        setRotation((prevRotation) => ({
          x: prevRotation.x,
          y: prevRotation.y + ySpin,
          z: prevRotation.z + zSpin,
        }));
      }, 1000 / 60);
      return () => clearInterval(interval);
    }, 100);
  }, []);

  useEffect(() => {
    if (!cubeRef.current) return;
    cubeRef.current!.rotation.set(rotation.x, rotation.y, rotation.z);
  }, [cubeRef.current, rotation]);

  return (
    <CardContainer
      onMouseEnter={() => handleEnter()}
      onMouseLeave={() => setHovering(false)}
      onClick={() => handleClick()}
      //@ts-ignore
      transition={{
        duration: ANIM_DURATION,
        ease: "easeInOut",
      }}
      animate={{
        scale: hovering ? [1, 1.1] : justRendered ? 1 : [1.1, 1],
      }}
    >
      {/* @ts-ignore */}
      <BlockTitle>{block}</BlockTitle>
      <BlockPriceContainer>
        <BlockPrice>M 1000</BlockPrice>
      </BlockPriceContainer>

      <BlockRepContainer>
        <BlockCanvasContainer>
          {mounted ? (
            <Canvas style={{ width: "95%", height: "95%" }}>
              <color attach="background" args={["#000"]} />
              <mesh ref={cubeRef}>
                <boxGeometry attach="geometry" args={[3, 3, 3]} />
                <meshBasicMaterial
                  attach="material"
                  map={activeTexture}
                  transparent={true}
                  opacity={block === Block.Glass ? 0.6 : 1}
                />
              </mesh>
            </Canvas>
          ) : undefined}
        </BlockCanvasContainer>
      </BlockRepContainer>
      <Flex justifyContent="space-between" p="5px">
        <BalanceText>Balance:</BalanceText>
        <BalanceText>0</BalanceText>
      </Flex>
    </CardContainer>
  );
};

const BlockPriceContainer = chakra(Flex, {
  baseStyle: {
    w: "100%",
    justifyContent: "flex-end",
    px: "5px",
  },
});

const BlockCanvasContainer = chakra(Center, {
  baseStyle: {
    w: "100%",
    h: "100%",
    position: "absolute",
    borderRadius: "10px",
    bg: "black",
  },
});

const BlockRepContainer = chakra(Flex, {
  baseStyle: {
    w: "100%",
    h: "70%",
    borderRadius: "10px",
    position: "relative",
  },
});

const BlockTitle = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Aquire",
    fontSize: "18px",
  },
});

const BlockPrice = chakra(Text, {
  baseStyle: {
    color: "white",
    fontSize: "18px",
  },
});

const BalanceText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
  },
});

const CardContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    w: "200px",
    h: "300px",
    borderRadius: 10,
    bgGradient: mainBG,
    border: "2px solid white",
    cursor: "pointer",
    flexDirection: "column",
    alignItems: "center",
    p: "5px",
    m: "20px",
  },
});

export default MarketplaceBlockCard;
