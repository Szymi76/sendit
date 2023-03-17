import { createContext, useState, useMemo, useContext } from "react";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import themeWithoutPalette from "./themeWithoutPalette";
import lightPalette from "./lightPalette";
import darkPalette from "./darkPalette";

export type ColorMode = "light" | "dark";

export type ColorModeContextTypes = { toggleColorMode: () => void };

export const ColorModeContext = createContext<ColorModeContextTypes | null>(null);

export type ColorModeProviderProps = { children: React.ReactNode };

export const MuiProvider = ({ children }: ColorModeProviderProps) => {
  const initialMode = localStorage.getItem("theme") as ColorMode;
  const [mode, setMode] = useState<ColorMode>(initialMode ? initialMode : "light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme", newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        ...themeWithoutPalette,
        palette: mode == "light" ? lightPalette.palette : darkPalette.palette,
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const colorMode = useContext(ColorModeContext)!;
  return colorMode;
};
