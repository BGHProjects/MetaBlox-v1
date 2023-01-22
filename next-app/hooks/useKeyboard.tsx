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
    Digit1: "dirt",
    Digit2: "grass",
    Digit3: "glass",
    Digit4: "wood",
    Digit5: "log",
    Digit6: "gold",
    Digit7: "opal",
    Digit8: "spaceinvaders",
    Digit9: "pacman",
    Digit0: "labryk",
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
    dirt: false,
    grass: false,
    glass: false,
    wood: false,
    log: false,
    gold: false,
    opal: false,
    spaceinvaders: false,
    pacman: false,
    labryk: false,
  });

  const handleKeyDown = useCallback((e) => {
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

  const handleKeyUp = useCallback((e) => {
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
