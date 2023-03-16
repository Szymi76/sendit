import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid } from "@mui/material";

type SingleFileInPreviewProps = { file: File; single: boolean; onRemove: () => void };

// POJEDYŃCZY PLIK W PODGLĄDZIE, PODCZAS GDY WYBRANE SĄ JAKIEŚ PLIKI DO WYSŁANIA
const SingleFileInPreview = ({ file, single, onRemove }: SingleFileInPreviewProps) => {
  const src = URL.createObjectURL(file);

  return (
    <Grid item position="relative" xs={single ? 12 : 6} display="flex" justifyContent="center" alignItems="center">
      <Box position="absolute" height="100%" width="100%" sx={{ opacity: "0", ":hover": { opacity: "1" } }}>
        <CloseIcon
          onClick={onRemove}
          fontSize="large"
          sx={{
            position: "absolute",
            top: "50%",
            right: "50%",
            transform: "translate(50%, -50%)",
            cursor: "pointer",
            bgcolor: "rgba(255,255,255,.50)",
            borderRadius: 9999,
            color: (theme) => theme.palette.grey[900],
          }}
        />
      </Box>
      <img src={src} width="90%" height="90%" alt="Wybrane zdjęcie" style={{ borderRadius: 5, objectFit: "cover" }} />
    </Grid>
  );
};

export default SingleFileInPreview;
