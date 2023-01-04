import { chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";

const AnimatedComponent = (component: any) =>
  chakra(component, {
    /**
     * Allow motion props and non-Chakra props to be forwarded.
     */
    shouldForwardProp: (prop) =>
      isValidMotionProp(prop) || shouldForwardProp(prop),
  });

const AnimatedDiv = AnimatedComponent(motion.div);
const AnimatedSpan = AnimatedComponent(motion.span);

export { AnimatedDiv, AnimatedSpan };
