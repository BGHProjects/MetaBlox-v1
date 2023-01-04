import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MenuItem from "../components/Menu/MenuItem";
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
      <Flex mt="50px">
        {localMenuContent === Content.GRID && (
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
        )}
      </Flex>
    </PageComponent>
  );
};

export default MainPage;
