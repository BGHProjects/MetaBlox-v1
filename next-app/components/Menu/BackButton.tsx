import { ChevronLeftIcon } from "@chakra-ui/icons";
import { chakra, Flex } from "@chakra-ui/react";
import AppButton from "./AppButton";

interface IBackButton {
  action: () => void;
}

/**
 * Common component that represents all back buttons used within the app
 * @param action The action that will occur when the button is pressed
 */
const BackButton = ({ action }: IBackButton) => {
  const size = 40;

  return (
    <>
      <ButtonPlacer>
        <AppButton
          w={size}
          h={size}
          action={action}
          component={<ChevronLeftIcon boxSize={10} color="white" />}
        />
      </ButtonPlacer>
    </>
  );
};

const ButtonPlacer = chakra(Flex, {
  baseStyle: {
    position: "absolute",
    top: "0",
    left: "0",
    cursor: "pointer",
  },
});

export default BackButton;
