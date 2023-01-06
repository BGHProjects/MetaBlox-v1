import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { AnimatedDiv } from "../components/AnimatedComponents";
import CustomCursor from "../components/Menu/CustomCursor";
import { AppStateContextProvider } from "../contexts/AppStateContext";
import "../styles/App.css";

export default function App({ Component, pageProps }: AppProps) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const cursorVariant = "default";

  const variants = {
    default: {
      x: cursorPosition.x,
      y: cursorPosition.y,
    },
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const theme = extendTheme({
    fonts: {
      metr: `Iceland, sans-serif`,
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <AppStateContextProvider>
        <Component {...pageProps} />
        <AnimatedDiv
          className="cursor"
          variants={variants}
          animate={cursorVariant}
          position="relative"
        >
          <CustomCursor />
        </AnimatedDiv>
      </AppStateContextProvider>
    </ChakraProvider>
  );
}
