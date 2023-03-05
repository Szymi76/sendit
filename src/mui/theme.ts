import { createTheme } from "@mui/material";

declare module "@mui/material/Fab" {
  interface FabPropsVariantOverrides {
    transparent: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans', sans-serif",
  },
  palette: {
    primary: {
      main: "#4f46e5",
    },
    background: {
      default: "#f8fafc",
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
    MuiFab: {
      variants: [
        {
          props: { variant: "transparent" },
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            ":hover": {
              backgroundColor: "transparent",
              backdropFilter: "brightness(90%)",
            },
          },
        },
      ],
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          // paddingLeft: "0px !important",
          // paddingTop: "0px !important",
        },
      },
    },
  },
});

export default theme;
