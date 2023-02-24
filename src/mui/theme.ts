import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans', sans-serif",
  },
  palette: {
    primary: {
      main: "#4f46e5",
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          width: "min-content",
          whiteSpace: "nowrap",
          textDecoration: "none",
          "::after": {
            content: "''",
            position: "absolute",
            bottom: "-2px",
            left: 0,
            width: "0%",
            height: "2px",
            backgroundColor: theme.palette.primary.main,
            transition: "width 500ms",
          },
          ":hover": {
            "::after": {
              width: "100%",
            },
          },
        }),
      },
    },
  },
});

export default theme;
