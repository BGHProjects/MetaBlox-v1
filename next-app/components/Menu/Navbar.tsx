import { Flex, Text, HStack, chakra } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Content } from "../../constants/menu";
import { useAppContext } from "../../contexts/AppStateContext";
import { AnimatedDiv, AnimatedSpan } from "../AnimatedComponents";

const NavBar = () => {
  const { menuContent, setMenuContent } = useAppContext();

  const text = "Faucet";

  const [hovering, setHovering] = useState(false);

  const ANIM_DURATION = 0.2;

  useEffect(() => {
    console.log("menuContent", menuContent);
  }, [menuContent]);

  return (
    //@ts-ignore
    <Container>
      <StyledText fontSize="30px" mt="30px">
        METABLOX
      </StyledText>
      <HStack spacing={20} mt="30px">
        <AnimatedDiv
          onClick={() => setMenuContent(Content.FAUCET)}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {text.split("").map((char, index) => (
            <AnimatedSpan
              color="white"
              fontSize="20px"
              fontWeight="bold"
              key={index}
              //@ts-ignore
              transition={{
                delay: (index * ANIM_DURATION) / text.length,
                duration: ANIM_DURATION,
                ease: "easeIn",
              }}
              animate={{
                color: hovering
                  ? ["rgb(255,255,255)", "rgb(255,0,0)", "rgb(255,255,255)"]
                  : ["rgb(255,255,255)", "rgb(255,255,255)"],
              }}
            >
              {char}
            </AnimatedSpan>
          ))}
        </AnimatedDiv>
        <StyledText onClick={() => setMenuContent(Content.MARKETPLACE)}>
          Marketplace
        </StyledText>
        <StyledText onClick={() => setMenuContent(Content.GRID)}>
          Grid
        </StyledText>
        <StyledText onClick={() => setMenuContent(Content.SANDBOX)}>
          Sandbox
        </StyledText>
      </HStack>
    </Container>
  );
};

const Container = chakra(Flex, {
  baseStyle: {
    w: "100%",
    bg: "transparent",
    alignItems: "center",
    flexDirection: "column",
    as: "nav",
  },
});

const StyledText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },
});

export default NavBar;
