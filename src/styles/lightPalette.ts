import { createTheme } from "@mui/material";

const lightPalette = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#FFFFFF",
    },
    success: {
      main: "#16a34a",
      light: "#86efac",
    },
    error: {
      main: "#ef4444",
      light: "#fca5a5",
    },
    background: {
      default: "#f8fafc",
    },
  },
});

export default lightPalette;
