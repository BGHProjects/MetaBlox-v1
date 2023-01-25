import { useEffect, useRef, useState } from "react";
import { gridBlue, gridPink } from "../../../constants/colours";
import useColourAnimation from "../../../hooks/useColorAnimation";

const Light = () => {
  const spotlight1Ref = useRef();
  const spotlight2Ref = useRef();
  const spotlight3Ref = useRef();
  const spotlight4Ref = useRef();

  spotlight1Ref.current?.target.position.set([-0.25, 0.25, 0.25]);
  spotlight2Ref.current?.target.position.set([0.25, 0.25, 0.25]);
  spotlight3Ref.current?.target.position.set([-0.25, 0.25, 0.25]);
  spotlight4Ref.current?.target.position.set([0.25, 0.25, 0.25]);

  const [lightColor, setLightColour] = useState("");

  const color = useColourAnimation(gridBlue, gridPink);

  useEffect(() => {
    setLightColour(color);
  }, [color]);

  return (
    <>
      <spotLight
        ref={spotlight1Ref}
        color={lightColor}
        intensity={40}
        position={[0.5, 0.75, 2.1]}
        distance={25}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        decay={10}
      />
      <spotLight
        ref={spotlight2Ref}
        color={lightColor}
        intensity={40}
        position={[-0.5, 0.75, 2.1]}
        distance={25}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        decay={0}
      />
      <spotLight
        ref={spotlight3Ref}
        color={lightColor}
        intensity={40}
        position={[0, -0.75, 3]}
        distance={25}
        angle={-Math.PI * 0.1}
        penumbra={0.25}
        decay={0}
      />
      <spotLight
        ref={spotlight4Ref}
        color={lightColor}
        intensity={40}
        position={[0, -0.75, 3]}
        distance={25}
        angle={-Math.PI * 0.1}
        penumbra={0.25}
        decay={0}
      />
    </>
  );
};

export default Light;