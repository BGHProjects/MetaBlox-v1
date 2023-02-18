import {
  chakra,
  HStack,
  Image,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { Block } from "../../../constants/blocks";
import useMarketplaceConfirmModal from "../../../hooks/components/marketplace/useMarketplaceConfirmModal";
import AppButton from "../AppButton";
import { gridBlue } from "../../../constants/colours";

interface IMarketplaceBlockConfirmModal {
  block: Block;
  closeFunction: () => void;
}

/**
 * Modal that is displayed when a user is attempting to purchase a block from the Marketplace
 * @param block The block that is being purchased
 * @param closeFunction Function that closes the modal
 */
const MarketplaceBlockConfirmModal = ({
  block,
  closeFunction,
}: IMarketplaceBlockConfirmModal) => {
  const { price, setNumberOfBlocks, handlePurchase, loading } =
    useMarketplaceConfirmModal(block, () => closeFunction());

  return (
    <Center position="relative" w="100%" h="100%">
      <VStack w="100%" h="100%" spacing={5}>
        {/* @ts-ignore */}
        <SubheadingText>
          How many {capitalize(block)} blocks would you like to purchase?
        </SubheadingText>
        <NumberInput defaultValue={1} min={1}>
          <NumberInputField
            color="white"
            fontFamily="Play"
            onChange={(e) => setNumberOfBlocks(Number(e.target.value))}
          />
        </NumberInput>
        <HStack spacing={1}>
          <PriceText>{price}</PriceText>
          <Image h="20px" w="20px" src="/images/mblox-logo.svg" />
        </HStack>
        <AppButton
          w={250}
          h={50}
          title={"CONFIRM PURCHASE"}
          action={handlePurchase}
        />
      </VStack>
      {loading && (
        <LoadingOverlay>
          <LoadingText>Purchasing MetaBlox</LoadingText>
          <Spinner size="xl" color={gridBlue} />
        </LoadingOverlay>
      )}
    </Center>
  );
};

const LoadingText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontFamily: "Play",
    fontSize: "20px",
    mb: "20px",
  },
});

const LoadingOverlay = chakra(Center, {
  baseStyle: {
    bottom: "-3.5",
    w: "115%",
    h: "144%",
    bg: "rgba(0,0,0,0.8)",
    zIndex: 1,
    position: "absolute",
    borderRadius: "10px",
    flexDir: "column",
  },
});

const PriceText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontSize: "20px",
    fontFamily: "Play",
  },
});

const SubheadingText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Play",
  },
});

export default MarketplaceBlockConfirmModal;
