import { useState } from "react";
import { useAppContext } from "../../contexts/AppStateContext";
import { AnimatedDiv } from "../AnimatedComponents";

const MenuOption = () => {
  const { setMenuContent, setCursorDefault, setCursorHover } = useAppContext();

  const [hovering, setHovering] = useState(false);

  const ANIM_DURATION = 0.3;

  const handleEnter = () => {
    setCursorHover();
    setHovering(true);
  };

  const handleLeave = () => {
    setCursorDefault();
    setHovering(false);
  };

  return (
    <AnimatedDiv
      onMouseEnter={() => handleEnter()}
      onMouseLeave={() => handleLeave()}
      w="400px"
      minW="400px"
      h="200px"
      borderRadius="10px"
      border="5px solid white"
      transition={{
        duration: ANIM_DURATION,
        ease: "easeInOut",
      }}
      animate={{
        scale: hovering ? [1, 1.1] : [1.1, 1],
      }}
    ></AnimatedDiv>
  );
};

export default MenuOption;
