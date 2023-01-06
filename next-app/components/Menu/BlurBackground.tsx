import { Flex } from "@chakra-ui/react";
import { mainBG } from "../../constants/colours";

const BlurBackground = () => (
  <Flex
    position="absolute"
    w="100%"
    h="100%"
    borderRadius="10px"
    bgGradient={mainBG}
    opacity={0.8}
    filter="blur(4px)"
  />
);

export default BlurBackground;
