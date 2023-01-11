import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { Content } from "../../constants/menu";
import { useAppContext } from "../../contexts/AppStateContext";
import AppButton from "./AppButton";

const BackButton = () => {
  const { setMenuContent } = useAppContext();

  const size = 40;

  return (
    <Flex position="absolute" top="0" left="0" cursor="pointer">
      <AppButton
        w={size}
        h={size}
        action={() => setMenuContent(Content.None)}
        component={<ChevronLeftIcon boxSize={10} color="white" />}
      />
    </Flex>
  );
};

export default BackButton;
