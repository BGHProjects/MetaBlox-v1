import { Flex, Text } from "@chakra-ui/react";
import BackButton from "./BackButton";

const Exchange = () => {
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
        EXCHANGE
      </Text>
    </Flex>
  );
};

export default Exchange;
