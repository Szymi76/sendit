import { Box } from "@mui/material";

export const Icon = ({ icon, onClick }: { icon: JSX.Element; onClick?: () => void }) => {
  return (
    <Box
      sx={{
        cursor: "pointer",
        color: "white",
        transitionDuration: "200ms",
        ":hover": {
          filter: "brightness(80%)",
          color: (theme) => theme.palette.primary.main,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
        border: "1px solid rgba(0, 0, 0, 0.15)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4px",
        borderRadius: "5px",
      }}
      onClick={onClick}
    >
      {icon}
    </Box>
  );
};
