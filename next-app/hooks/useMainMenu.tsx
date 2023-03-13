import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Content } from "../constants/menu";
import { useAppContext } from "../contexts/AppStateContext";

const useMainMenu = () => {
  const DELAY = 3;
  const DURATION = 2;
  const METABLOX = "METABLOX";
  const char_anim_duration = 1;
  const moveDelay = 3;

  const {
    menuContent,
    setMenuContent,
    startingGameplay,
    generateSandboxBG,
    generateMetaGridBG,
    enteringMetaGrid,
    viewMode,
    setGameWorldLoaded,
  } = useAppContext();

  const router = useRouter();
  const [display, setDisplay] = useState("flex");
  const [zIndex, setZIndex] = useState("1");
  const [titleZ, setTitleZ] = useState(3);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  useEffect(() => {
    setGameWorldLoaded(false);
    setMenuContent(Content.None);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setDisplay("none");
      setTitleZ(0);
    }, (DELAY + DURATION) * 1000);
  }, []);

  useEffect(() => {
    if (startingGameplay) {
      setZIndex("3");
      setDisplay("flex");
      generateSandboxBG();
      setTimeout(() => {
        router.push("/game");
      }, 3000);
    }
  }, [startingGameplay]);

  useEffect(() => {
    if (enteringMetaGrid) {
      setZIndex("3");
      setDisplay("flex");
      generateMetaGridBG();
      setTimeout(() => {
        router.push("/metagrid");
      }, 3000);
    }
  }, [enteringMetaGrid]);

  useEffect(() => {
    setTimeout(() => {
      setInitialLoadCompleted(true);
    }, moveDelay * 1000);
  }, []);

  return {
    DELAY,
    viewMode,
    menuContent,
    zIndex,
    display,
    startingGameplay,
    enteringMetaGrid,
    DURATION,
    titleZ,
    initialLoadCompleted,
    moveDelay,
    METABLOX,
    char_anim_duration,
  };
};

export default useMainMenu;
