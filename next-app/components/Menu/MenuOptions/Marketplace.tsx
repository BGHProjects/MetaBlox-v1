import { chakra, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Block } from "../../../constants/blocks";
import { orangeMain } from "../../../constants/colours";
import { useAppContext } from "../../../contexts/AppStateContext";
import AppModal from "../../AppModal";
import MarketplaceBlockCard from "../MarketplaceBlock/MarketplaceBlockCard";
import MarketplaceBlockConfirmModal from "../MarketplaceBlock/MarketplaceBlockConfirmModal";

/**
 * Displays the Marketplace content in the Menu Option
 */
const Marketplace = () => {
  const blocks = Object.keys(Block);
  const [open, setOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | undefined>();
  const { metaBloxBalances } = useAppContext();

  const handleSelectBlock = (block: Block) => {
    setSelectedBlock(block);
    setOpen(true);
  };

  const closeFunction = () => {
    setSelectedBlock(undefined);
    setOpen(false);
  };

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
        {blocks.map((block, idx) => (
          <MarketplaceBlockCard
            key={block}
            block={Block[block as keyof typeof Block]}
            /* @ts-ignore */
            balance={metaBloxBalances[idx]}
            handleClick={() =>
              handleSelectBlock(Block[block as keyof typeof Block])
            }
          />
        ))}
      </CardContainer>
      <AppModal
        closeFunction={() => closeFunction()}
        isOpen={open}
        title={(("PURCHASE " + selectedBlock) as string) + " BLOCK"}
        content={
          <MarketplaceBlockConfirmModal
            block={selectedBlock as Block}
            closeFunction={() => closeFunction()}
          />
        }
      />
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
