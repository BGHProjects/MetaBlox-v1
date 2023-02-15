import { chakra, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppContext } from "../../contexts/AppStateContext";
import AppButton from "./AppButton";
import BlurBackground from "./BlurBackground";

/**
 * Customized wallet connection modal present on the main manu
 * which allows users to connect their wallets to the application
 */
const WalletConnectButton = () => {
  const { mBloxBalance, playerColour } = useAppContext();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const connected = mounted && account && chain;

        if (!mounted) {
          return <></>;
        }

        if (!connected)
          return (
            <AppButton
              h={40}
              w={200}
              action={openConnectModal}
              title="Connect Wallet"
            />
          );

        if (chain.unsupported)
          return (
            <AppButton
              h={40}
              w={200}
              action={openChainModal}
              title="Wrong Network"
            />
          );

        return (
          <HStack>
            <Flex alignItems="center" position="relative" h="40px">
              <BlurBackground />
              {/* @ts-ignore */}
              <BalanceContainer borderColor={playerColour ?? "transparent"}>
                <Text color="white" fontFamily="Play">
                  {mBloxBalance}
                </Text>
                <Image h="20px" w="20px" src="/images/mblox-logo.svg" />
              </BalanceContainer>
            </Flex>
            <AppButton
              h={40}
              w={100}
              action={openAccountModal}
              title={account.displayName}
              fontSize={16}
            />
          </HStack>
        );
      }}
    </ConnectButton.Custom>
  );
};

const BalanceContainer = chakra(HStack, {
  baseStyle: {
    zIndex: "1",
    minW: "150px",
    w: "fit-content",
    justifyContent: "flex-end",
    p: "10px",
    border: "3px solid transparent",
    borderRadius: "12px",
    h: "95%",
    mb: "2px",
  },
});

export default WalletConnectButton;
