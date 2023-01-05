import { Flex, Text } from "@chakra-ui/react";
import BackButton from "./BackButton";

const Grid = () => {
  return (
    <Flex
      w="100%"
      h="100%"
      flexDirection="column"
      position="relative"
      alignItems="center"
    >
      <BackButton />
      <Text color="white" fontSize="20px">
        GRID
      </Text>
    </Flex>
  );
};

export default Grid;
