import { chakra, Flex } from "@chakra-ui/react";
import { Block } from "../../../constants/blocks";
import { orangeMain } from "../../../constants/colours";
import MarketplaceBlockCard from "../../MarketplaceBlockCard";

const Marketplace = () => {
  const blocks = Object.keys(Block);

  return (
    <>
      {/* @ts-ignore */}
      <CardContainer
        sx={{
          "&::-webkit-scrollbar": {
            w: "2",
            mr: "10",
          },
          "&::-webkit-scrollbar-track": {
            w: "6",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "10",
            bg: orangeMain,
          },
        }}
      >
        {blocks.map((block) => (
          <MarketplaceBlockCard
            key={block}
            block={Block[block as keyof typeof Block]}
          />
        ))}
      </CardContainer>
    </>
  );
};

const CardContainer = chakra(Flex, {
  baseStyle: {
    w: "100%",
    h: "100%",
    p: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
    overflowY: "auto",
  },
});

export default Marketplace;
