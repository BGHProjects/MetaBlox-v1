import { VStack, Text, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Status } from "../../../constants/worldTokens";
import AppButton from "../AppButton";

interface IGridModalContent {
  idx: number;
  status: Status;
  colour: string;
}

const GridModalContent = ({ idx, status, colour }: IGridModalContent) => {
  const router = useRouter();

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

  return (
    <VStack alignItems="center" spacing={10} p="20px">
      <Text color="white" fontWeight="bold" fontSize="20px" textAlign="center">
        {textContent[status].title}
      </Text>
      <Center
        border="2px solid white"
        borderRadius="10px"
        bg={colour}
        h="100px"
        w="100px"
      >
        <VStack alignItems="center">
          <Text color="white" textAlign="center">
            X : {calculateXY(idx).x}
          </Text>
          <Text color="white" textAlign="center">
            Y : {calculateXY(idx).y}
          </Text>
        </VStack>
      </Center>
      <Text color="white" textAlign="center">
        {textContent[status].subtitle}
      </Text>
      <AppButton
        h={60}
        w={300}
        title={textContent[status].buttonTitle}
        action={() => router.push("/game")}
      />
    </VStack>
  );
};

export default GridModalContent;
