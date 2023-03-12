import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai, hardhat, localhost } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { AppStateContextProvider } from "../contexts/AppStateContext";
import "../styles/App.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [polygonMumbai, hardhat],
    [
      // alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY as string }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "MetaBlox",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const theme = extendTheme({
    fonts: {
      Iceland: `Iceland, sans-serif`,
      Aquire: `Aquire, sans-serif`,
      Play: `Play, sans-serif`,
    },
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
          <AppStateContextProvider>
            <Head>
              <title>METABLOX</title>
            </Head>
            <Component {...pageProps} />
          </AppStateContextProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
