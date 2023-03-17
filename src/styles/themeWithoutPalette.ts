import { createTheme } from "@mui/material";

declare module "@mui/material/Fab" {
  interface FabPropsVariantOverrides {
    transparent: true;
  }
}

const themeWithoutPalette = createTheme({
  typography: {
    fontFamily: "'Noto Sans', sans-serif",
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
    MuiModal: {
      styleOverrides: {
        root: {
          zIndex: 3000,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          zIndex: 1300,
          backgroundImage: "none",
        },
      },
    },
  },
});

export default themeWithoutPalette;
