import { Cursor } from "../../constants/menu";
import { useAppContext } from "../../contexts/AppStateContext";
import { AnimatedDiv } from "../AnimatedComponents";

const SIZE = 25;
const SCALE_SIZE = 2 / 3;

const CustomCursor = () => {
  const { cursorState } = useAppContext();

  return (
    <AnimatedDiv
      initial={{ opacity: 0 }}
      // @ts-ignore
      transition={{ duration: 0.2 }}
      animate={{
        scale:
          cursorState === Cursor.Default ? [SCALE_SIZE, 1] : [1, SCALE_SIZE],
        opacity: 1,
      }}
      css={{
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        borderRadius: "50%",
        background: cursorState === Cursor.Default ? "transparent" : "white",
        border: cursorState === Cursor.Default ? "2px solid white" : "none",
      }}
    />
  );
};

export default CustomCursor;
