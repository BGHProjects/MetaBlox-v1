import { ReactNode } from "react";
import { AnimatedDiv } from "../AnimatedComponents";

interface IMenuItem {
  condition: boolean;
  children: ReactNode | ReactNode[];
  animDuration: number;
}

const MenuItem = ({ condition, children, animDuration }: IMenuItem) => {
  return (
    <AnimatedDiv
      animate={{
        opacity: condition ? [0, 1] : [1, 0],
        scale: condition ? [0.5, 1] : [1, 0.5],
      }}
      //@ts-ignore
      transition={{ duration: animDuration, ease: "easeInOut" }}
    >
      {children}
    </AnimatedDiv>
  );
};

export default MenuItem;
