import { useCallback, useEffect, useState } from "react";

const actionByKey = (key: string) => {
  const keyActionMap: Record<string, string> = {
    KeyQ: "quit",
    KeyY: "quitWithSaving",
    KeyN: "quitWithoutSaving",
    KeyC: "toggleControls",
    KeyW: "moveForward",
    KeyS: "moveBackward",
    KeyA: "moveLeft",
    KeyD: "moveRight",
    Space: "jump",
    ShiftLeft: "sprint",
    ShiftRight: "sprint",
    Digit1: "dirt",
    Digit2: "grass",
    Digit3: "log",
    Digit4: "wood",
    Digit5: "glass",
    Digit6: "lava",
    Digit7: "gold",
    Digit8: "opal",
    Digit9: "amethyst",
    Digit0: "space",
  };
  return keyActionMap[key];
};

const useKeyboard = () => {
  const [actions, setActions] = useState({
    quit: false,
    quitWithSaving: false,
    quitWithoutSaving: false,
    toggleControls: false,
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    sprint: false,
    dirt: false,
    grass: false,
    glass: false,
    wood: false,
    log: false,
    lava: false,
    gold: false,
    opal: false,
    amethyst: false,
    space: false,
  });

  const handleKeyDown = useCallback((e: any) => {
    const action = actionByKey(e.code);
    if (action) {
      setActions((prev) => {
        return {
          ...prev,
          [action]: true,
        };
      });
    }
  }, []);

  const handleKeyUp = useCallback((e: any) => {
    const action = actionByKey(e.code);
    if (action) {
      setActions((prev) => {
        return {
          ...prev,
          [action]: false,
        };
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return actions;
};

export default useKeyboard;
