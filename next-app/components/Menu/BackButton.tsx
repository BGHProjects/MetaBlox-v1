import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Center, Flex } from "@chakra-ui/react";
import { Content } from "../../constants/menu";
import { useAppContext } from "../../contexts/AppStateContext";
import AppButton from "./AppButton";

const BackButton = () => {
  const { setMenuContent, setCursorDefault, setCursorHover } = useAppContext();

  const handleClick = () => {
    setCursorDefault();
    setMenuContent(Content.None);
  };

  const size = 40;

  return (
    <Flex position="absolute" top="0" left="0">
      <AppButton
        w={size}
        h={size}
        action={() => handleClick()}
        component={<ChevronLeftIcon boxSize={10} color="white" />}
      />
    </Flex>
  );
};

export default BackButton;
