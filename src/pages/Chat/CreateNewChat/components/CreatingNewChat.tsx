import { Box, CircularProgress } from "@mui/material";

// ŁADOWANIE PODCZAS TWORZENIA NOWEGO CZATU
const CreatingNewChat = () => {
  return (
    <Box
      position="fixed"
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
      zIndex={2000}
    >
      <CircularProgress color="primary" size={60} />
    </Box>
  );
};

export default CreatingNewChat;
