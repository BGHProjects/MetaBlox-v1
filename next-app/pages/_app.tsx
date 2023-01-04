import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { AppStateContextProvider } from "../contexts/AppStateContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AppStateContextProvider>
        <Component {...pageProps} />
      </AppStateContextProvider>
    </ChakraProvider>
  );
}
