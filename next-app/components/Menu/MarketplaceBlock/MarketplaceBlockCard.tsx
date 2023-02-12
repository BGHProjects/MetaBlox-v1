import { Center, chakra, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { Block, blockPrices } from "../../../constants/blocks";
import { mainBG } from "../../../constants/colours";
import useMarketplaceBlockCard from "../../../hooks/components/marketplace/useMarketplaceBlockCard";
import { AnimatedDiv } from "../../AnimatedComponents";
import MarketplaceBlockPreview from "./MarketplaceBlockPreview";

const ANIM_DURATION = 0.3;

interface IMarketplaceBlockCard {
  block: Block;
  handleClick: () => void;
  balance: number;
}

/**
 * UI component that represents a block for sale in the Marketplace
 * @param block The type of block
 * @param handleClick The action that is performed when this is clicked on
 * @param balance The amount of this type of block that the current user owns
 */
const MarketplaceBlockCard = ({
  block,
  handleClick,
  balance,
}: IMarketplaceBlockCard) => {
  const {
    handleEnter,
    setHovering,
    hovering,
    justRendered,
    mounted,
    activeTexture,
  } = useMarketplaceBlockCard(block);

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
        <HStack spacing={1}>
          <BlockPrice> {blockPrices[block]}</BlockPrice>
          <Image h="20px" w="20px" src="/images/mblox-logo.svg" />
        </HStack>
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
        <BalanceText>{balance}</BalanceText>
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
