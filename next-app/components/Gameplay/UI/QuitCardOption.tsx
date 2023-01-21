import { VStack, Center, Text } from "@chakra-ui/react";
import { buttonBG } from "../../../constants/colours";

interface IQuitCardOption {
  saveOption: boolean;
}

const size = "50px";

const QuitCardOption = ({ saveOption }: IQuitCardOption) => {
  const displayItems: Record<string, { button: string; label: string }> = {
    true: { button: "Y", label: "save and quit" },
    false: { button: "N", label: "quit" },
  };

  return (
    <VStack spacing={3} w="100px">
      <Center
        bgGradient={buttonBG}
        borderRadius="10px"
        border="1px solid white"
        h={size}
        w={size}
      >
        <Text color="white" fontSize="30px">
          {displayItems[saveOption.toString()].button}
        </Text>
      </Center>
      <Text color="white" textAlign="center">
        {`Press ${displayItems[saveOption.toString()].button} to ${
          displayItems[saveOption.toString()].label
        }`}
      </Text>
    </VStack>
  );
};

export default QuitCardOption;
