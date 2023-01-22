import { Flex } from "@chakra-ui/react";
import { useAppContext } from "../../../contexts/AppStateContext";
import AppButton from "../AppButton";

const Sandbox = () => {
  const { setStartingGameplay } = useAppContext();

  return (
    <Flex alignItems="center" mt="30px">
      <AppButton
        w={300}
        h={80}
        title={"ENTER SANDBOX"}
        action={() => setStartingGameplay(true)}
        fontSize={26}
      />
    </Flex>
  );
};

export default Sandbox;
