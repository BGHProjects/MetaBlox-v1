import { Center, Text, VStack, chakra, useToast } from "@chakra-ui/react";
import { GameState } from "../../../constants/game";
import { Status } from "../../../constants/worldTokens";
import { useAppContext } from "../../../contexts/AppStateContext";
import AppButton from "../AppButton";

interface IGridModalContent {
  idx: number;
  status: Status;
  colour: string;
}

/**
 * Represents the UI content within the modal from the Grid component
 * @param idx The index passed in
 * @param status Whether this World is Vacant, Unavailable, or Owned
 * @param colour The colour passed in
 */
const GridModalContent = ({ idx, status, colour }: IGridModalContent) => {
  const { setStartingGameplay, setGameState } = useAppContext();
  const toast = useToast();

  const textContent: Record<
    Status,
    { title: string; subtitle: string; buttonTitle: string }
  > = {
    [Status.Vacant]: {
      title: "VACANT WORLD",
      subtitle:
        "This world is unowned and available for purchase! You may purchase this world token for 100 MBLOX.",
      buttonTitle: "PURCHASE WORLD",
    },
    [Status.Unavailable]: {
      title: "OWNED WORLD",
      subtitle:
        "This world is owned by user 0xq09qjcjw9q80ecjqwe. You may visit their world to see what they have created!",
      buttonTitle: "VISIT WORLD",
    },
    [Status.Owned]: {
      title: "YOUR WORLD",
      subtitle:
        "You own this world. You may enter now and build to your heart's content.",
      buttonTitle: "START BUILDING",
    },
  };

  const calculateXY = (idx: number) => {
    let x = idx % 10;
    let y = Math.ceil(idx / 10);
    return { x, y };
  };

  const handleClick = () => {
    if (status !== Status.Vacant) {
      setGameState(
        status === Status.Owned ? GameState.Building : GameState.Visiting
      );
      setStartingGameplay(true);
      return;
    }

    toast({
      title: "Not yet implemented",
      description: "This functionality is not yet implemented",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <VStack alignItems="center" spacing={10} p="20px">
      <Title>{textContent[status].title}</Title>
      <Center
        border="2px solid white"
        borderRadius="10px"
        bg={colour}
        h="100px"
        w="100px"
      >
        <VStack alignItems="center">
          <ModalTextContent>X : {calculateXY(idx).x}</ModalTextContent>
          <ModalTextContent>Y : {calculateXY(idx).y}</ModalTextContent>
        </VStack>
      </Center>
      <ModalTextContent>{textContent[status].subtitle}</ModalTextContent>
      <AppButton
        h={60}
        w={300}
        title={textContent[status].buttonTitle}
        action={() => handleClick()}
      />
    </VStack>
  );
};

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

export default GridModalContent;
