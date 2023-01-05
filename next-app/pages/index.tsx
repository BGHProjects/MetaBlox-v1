import { Center, chakra, HStack } from "@chakra-ui/react";
import {
  Exchange,
  Grid,
  Marketplace,
  MenuOption,
  PageComponent,
  Sandbox,
} from "../components/Menu";
import MenuBackground from "../components/Menu/MenuBackground";
import { Content } from "../constants/menu";
import { useAppContext } from "../contexts/AppStateContext";

const ANIM_DURATION = 0.5;

const MainPage = () => {
  const { menuContent } = useAppContext();

  return (
    <>
      <MenuBackground />
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
          {menuContent === Content.None && (
            <>
              {/*//@ts-ignore */}
              <RowContainer>
                <MenuOption menuOption={Content.Grid} />
                <MenuOption menuOption={Content.Sandbox} />
              </RowContainer>
              <RowContainer>
                <MenuOption menuOption={Content.Exchange} />
                <MenuOption menuOption={Content.Marketplace} />
              </RowContainer>
            </>
          )}
          {menuContent === Content.Grid && <Grid />}
          {menuContent === Content.Sandbox && <Sandbox />}
          {menuContent === Content.Marketplace && <Marketplace />}
          {menuContent === Content.Exchange && <Exchange />}
        </Center>
      </PageComponent>
    </>
  );
};

const RowContainer = chakra(HStack, {
  baseStyle: {
    w: "100%",
    h: "fit-content",
    justifyContent: "space-evenly",
  },
});

export default MainPage;
