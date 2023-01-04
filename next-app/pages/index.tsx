import { Flex, HStack, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MenuItem from "../components/Menu/MenuItem";
import MenuOption from "../components/Menu/MenuOption";
import PageComponent from "../components/Menu/PageComponent";
import { Content } from "../constants/menu";
import { useAppContext } from "../contexts/AppStateContext";

const ANIM_DURATION = 0.5;

const MainPage = () => {
  const { menuContent } = useAppContext();

  const [localMenuContent, setLocalMenuContent] =
    useState<Content>(menuContent);

  useEffect(() => {
    setTimeout(() => setLocalMenuContent(menuContent), ANIM_DURATION * 1000);
  }, [menuContent]);

  return (
    <PageComponent>
      <Center
        mt="50px"
        maxW="1000px"
        w="1000px"
        h="600px"
        border="1px solid gold"
        flexDirection="column"
        justifyContent="space-evenly"
      >
        <HStack w="100%" h="fit-content" justifyContent={"space-evenly"}>
          <MenuOption />
          <MenuOption />
        </HStack>
        <HStack w="100%" h="fit-content" justifyContent={"space-evenly"}>
          <MenuOption />
          <MenuOption />
        </HStack>
        {/* {localMenuContent === Content.GRID && (
          <MenuItem
            condition={menuContent === Content.GRID}
            animDuration={ANIM_DURATION}
          >
            <Flex h="500px" w="500px" bg="green"></Flex>
          </MenuItem>
        )}
        {localMenuContent === Content.MARKETPLACE && (
          <MenuItem
            condition={menuContent === Content.MARKETPLACE}
            animDuration={ANIM_DURATION}
          >
            <Flex h="500px" w="500px" bg="red"></Flex>
          </MenuItem>
        )}
        {localMenuContent === Content.FAUCET && (
          <MenuItem
            condition={menuContent === Content.FAUCET}
            animDuration={ANIM_DURATION}
          >
            <Flex h="500px" w="500px" bg="dodgerblue"></Flex>
          </MenuItem>
        )}
        {localMenuContent === Content.SANDBOX && (
          <MenuItem
            condition={menuContent === Content.SANDBOX}
            animDuration={ANIM_DURATION}
          >
            <Flex h="500px" w="500px" bg="gold"></Flex>
          </MenuItem>
        )} */}
      </Center>
    </PageComponent>
  );
};

export default MainPage;
