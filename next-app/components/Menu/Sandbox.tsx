import { Flex, Text } from "@chakra-ui/react";
import BackButton from "./BackButton";

const Sandbox = () => {
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
        SANDBOX
      </Text>
    </Flex>
  );
};

export default Sandbox;
