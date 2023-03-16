import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, Fab, IconButton, SxProps, Theme } from "@mui/material";

import AvatarV2 from "./AvatarV2";

export type FileInputProps = {
  file: File | string | null | undefined;
  textToRepleceFile?: string;
  onFileClear: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme>;
};

// INPUT TYPU 'file' Z CZYSZCZENIEM WYBRANEGO PLIKU
// AKCEPTUJE TYLKO PLILI TYPU 'image'
const FileInput = ({ file, textToRepleceFile, onFileChange, onFileClear, sx }: FileInputProps) => {
  if (file && typeof file != "string") file = URL.createObjectURL(file);

  return (
    <Box position="relative" sx={sx}>
      <AvatarV2 name={textToRepleceFile} src={file} sx={{ height: 100, width: 100 }} />
      <Fab size="small" sx={{ position: "absolute", bottom: -10, left: 70, zIndex: 10 }}>
        {file ? (
          <ClearIcon onClick={onFileClear} />
        ) : (
          <IconButton hidden component="label">
            <AddPhotoAlternateIcon />
            <input type="file" accept="image/*" hidden onChange={onFileChange} />
          </IconButton>
        )}
      </Fab>
    </Box>
  );
};

export default FileInput;
