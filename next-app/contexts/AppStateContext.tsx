import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Content, Cursor } from "../constants/menu";

interface IAppStateContext {
  menuContent: Content;
  setMenuContent: Dispatch<SetStateAction<Content>>;
  cursorState: Cursor;
  setCursorHover: () => void;
  setCursorDefault: () => void;
}

const AppStateContext = createContext<IAppStateContext>({} as IAppStateContext);

const AppStateContextProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [menuContent, setMenuContent] = useState<Content>(Content.GRID);
  const [cursorState, setCursorState] = useState<Cursor>(Cursor.Default);

  const setCursorHover = () => setCursorState(Cursor.Hover);
  const setCursorDefault = () => setCursorState(Cursor.Default);

  return (
    <AppStateContext.Provider
      value={{
        menuContent,
        setMenuContent,
        setCursorDefault,
        setCursorHover,
        cursorState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

const useAppContext = () => useContext(AppStateContext);

export { AppStateContextProvider, useAppContext };
