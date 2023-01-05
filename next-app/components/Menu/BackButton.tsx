import { Center, Text } from "@chakra-ui/react";
import { Content } from "../../constants/menu";
import { useAppContext } from "../../contexts/AppStateContext";

const BackButton = () => {
  const { setMenuContent, setCursorDefault, setCursorHover } = useAppContext();

  const handleClick = () => {
    setCursorDefault();
    setMenuContent(Content.None);
  };

  return (
    <Center
      position="absolute"
      top="0"
      left="0"
      w="50px"
      h="50px"
      borderRadius="10px"
      border="3px solid white"
      onMouseEnter={() => setCursorHover()}
      onMouseLeave={() => setCursorDefault()}
      onClick={() => handleClick()}
    >
      <Text fontWeight="bold">X</Text>
    </Center>
  );
};

export default BackButton;
