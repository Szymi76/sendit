import { Box, CircularProgress } from "@mui/material";

// ŁADOWANIE PODCZAS GDY POBIERANE SĄ CZATY
const FetchingChats = () => {
  return (
    <Box display="flex" justifyContent="center" mt={3}>
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default FetchingChats;
