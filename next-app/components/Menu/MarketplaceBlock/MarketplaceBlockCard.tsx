import { Center, chakra, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NearestFilter, RepeatWrapping, Texture, TextureLoader } from "three";
import { Block, blockToImage } from "../../../constants/blocks";
import { mainBG } from "../../../constants/colours";
import { AnimatedDiv } from "../../AnimatedComponents";
import MarketplaceBlockPreview from "./MarketplaceBlockPreview";

const ANIM_DURATION = 0.3;

interface IMarketplaceBlockCard {
  block: Block;
  handleClick: () => void;
}

/**
 * UI component that represents a block for sale in the Marketplace
 * @param block The type of block
 * @param handleClick The action that is performed when this is clicked on
 */
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
      <BlockTitle>{block}</BlockTitle>
      <BlockPriceContainer>
        <BlockPrice>M 1000</BlockPrice>
      </BlockPriceContainer>

      <BlockRepContainer>
        <BlockCanvasContainer>
          {mounted ? (
            <MarketplaceBlockPreview
              activeTexture={activeTexture}
              block={block}
            />
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
    fontFamily: "Play",
  },
});

const BalanceText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Play",
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
