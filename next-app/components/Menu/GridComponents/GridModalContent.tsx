import { Center, chakra, Spinner, Text, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { gridBlue } from "../../../constants/colours";
import { Status, textContent } from "../../../constants/worldTokens";
import useGridModal from "../../../hooks/components/grid/useGridModal";
import AppButton from "../AppButton";

interface IGridModalContent {
  x: number;
  y: number;
  status: Status;
  colour: string;
  closeFunction: () => void;
  worldId: number | undefined;
}

/**
 * Represents the UI content within the modal from the Grid component
 * @param x The x coordinate of this grid parcel
 * @param y The y coordinate of this grid parcel
 * @param status Whether this World is Vacant, Unavailable, or Owned
 * @param colour The colour passed in
 * @param closeFunction Function that closes the modal
 * @param worldId The id of the World token associated with this Grid Parcel
 */
const GridModalContent = ({
  x,
  y,
  status,
  colour,
  closeFunction,
  worldId,
}: IGridModalContent) => {
  const { coords, handleClick, loading } = useGridModal(
    x,
    y,
    status,
    closeFunction,
    worldId
  );

  return (
    <FullContainer>
      <VStack alignItems="center" spacing={10} p="20px">
        {/* @ts-ignore */}
        <Title>{textContent[status].title}</Title>
        <ParcelInfoContainer bg={colour}>
          <VStack alignItems="center">
            <ModalTextContent textShadow="1px 1px 5px black">
              X : {coords.x}
            </ModalTextContent>
            <ModalTextContent textShadow="1px 1px 5px black">
              Y : {coords.y}
            </ModalTextContent>
          </VStack>
        </ParcelInfoContainer>
        <ModalTextContent>{textContent[status].subtitle}</ModalTextContent>
        <AppButton
          h={60}
          w={300}
          title={textContent[status].buttonTitle}
          action={handleClick}
        />
      </VStack>
      {loading && (
        <LoadingOverlay>
          <LoadingText>Purchasing World</LoadingText>
          <Spinner size="xl" color={gridBlue} />
        </LoadingOverlay>
      )}
    </FullContainer>
  );
};

const ParcelInfoContainer = chakra(Center, {
  baseStyle: {
    border: "2px solid white",
    borderRadius: "10px",
    h: "100px",
    w: "100px",
  },
});

const FullContainer = chakra(Center, {
  baseStyle: {
    position: "relative",
    w: "100%",
    h: "100%",
  },
});

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
    h: "114%",
    bg: "rgba(0,0,0,0.8)",
    zIndex: 1,
    position: "absolute",
    borderRadius: "10px",
    flexDir: "column",
  },
});

const ModalTextContent = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Play",
  },
});

const Title = chakra(Text, {
  baseStyle: {
    color: "white",
    fontFamily: "Aquire",
    fontSize: "20px",
    textAlign: "center",
  },
});

export default memo(GridModalContent);
