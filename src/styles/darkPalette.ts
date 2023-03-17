import { createTheme } from "@mui/material";

const darkPalette = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0f172a",
    },
    secondary: {
      main: "#e2e8f0",
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
    grey: {
      "50": "#0f172a",
      "100": "#1e293b",
      "200": "#334155",
      "300": "#64748b",
      // "400": "#64748b",
      // "500": "#94a3b8",
      // "600": "#cbd5e1",
      "900": "#e2e8f0",
    },
    common: {
      black: "#0f172a",
    },
  },
});

export default darkPalette;
