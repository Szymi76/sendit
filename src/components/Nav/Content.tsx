import { Box, styled } from "@mui/material";

import useAuth from "../../firebase/hooks/useAuth";

export const Wrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 44,
  position: "fixed",
  zIndex: 30,
  backgroundColor: "rgba(79, 70, 229, .9)",
  backdropFilter: "blur(5px)",
  padding: "0 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const Actions = styled(Box)({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
});

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
          backgroundColor: "white",
        },
        border: "1px solid rgba(255, 255, 255, 0.15)",
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
