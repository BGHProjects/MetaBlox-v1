import { Flex, chakra } from "@chakra-ui/react";
import { ReactNode } from "react";
import { mainBG } from "../../constants/colours";
import NavBar from "./Navbar";

interface IPageComponent {
  children: ReactNode | ReactNode[];
}

const PageComponent = ({ children }: IPageComponent) => {
  return (
    // @ts-ignore
    <PageContainer>
      <NavBar />
      {children}
    </PageContainer>
  );
};

const PageContainer = chakra(Flex, {
  baseStyle: {
    flexDirection: "column",
    w: "100%",
    minH: "100vh",
    alignItems: "center",
    bg: mainBG,
  },
});

export default PageComponent;
