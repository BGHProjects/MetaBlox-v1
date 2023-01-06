import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import AppButton from "../AppButton";

const Sandbox = () => {
  const router = useRouter();

  return (
    <Flex alignItems="center" mt="30px">
      <AppButton
        w={300}
        h={80}
        title={"ENTER SANDBOX"}
        action={() => router.push("/game")}
        fontSize={26}
      />
    </Flex>
  );
};

export default Sandbox;
