import {
  chakra,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { Block, blockPrices } from "../constants/blocks";
import AppButton from "./Menu/AppButton";

interface IMarketplaceBlockConfirmModal {
  block: Block;
}

const MarketplaceBlockConfirmModal = ({
  block,
}: IMarketplaceBlockConfirmModal) => {
  const toast = useToast();
  const [numberOfBlocks, setNumberOfBlocks] = useState(1);
  const [price, setPrice] = useState(numberOfBlocks * blockPrices[block]);

  useEffect(() => {
    setPrice(numberOfBlocks * blockPrices[block]);
  }, [numberOfBlocks]);

  const handlePurchase = () => {
    toast({
      title: "Not Yet Implemented",
      description: "This functionality has not yet been implemented",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <VStack w="100%" h="100%" spacing={5}>
      {/* @ts-ignore */}
      <SubheadingText>
        How many {capitalize(block)} blocks would you like to purchase?
      </SubheadingText>
      <NumberInput defaultValue={1} min={1}>
        <NumberInputField
          color="white"
          onChange={(e) => setNumberOfBlocks(Number(e.target.value))}
        />
      </NumberInput>
      <PriceText>M {price}</PriceText>
      <AppButton
        w={250}
        h={50}
        title={"CONFIRM PURCHASE"}
        action={() => handlePurchase()}
      />
    </VStack>
  );
};

const PriceText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },
});

const SubheadingText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
  },
});

export default MarketplaceBlockConfirmModal;
