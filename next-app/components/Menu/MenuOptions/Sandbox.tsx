import { Flex } from "@chakra-ui/react";
import { GameState } from "../../../constants/game";
import { useAppContext } from "../../../contexts/AppStateContext";
import AppButton from "../AppButton";

const Sandbox = () => {
  const { setStartingGameplay, setGameState } = useAppContext();

  const handleClick = () => {
    setGameState(GameState.Sandbox);
    setStartingGameplay(true);
  };

  return (
    <Flex alignItems="center" mt="30px">
      <AppButton
        w={300}
        h={80}
        title={"ENTER SANDBOX"}
        action={handleClick}
        fontSize={26}
      />
    </Flex>
  );
};

export default Sandbox;
