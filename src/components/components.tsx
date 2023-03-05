import FocusTrap from "@mui/base/FocusTrap";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Avatar,
  Box,
  Button,
  ButtonProps,
  Divider,
  Fab,
  IconButton,
  Modal,
  ModalProps,
  styled,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

/*
    Awatar na podstawie pliku lub tekstu
*/

export type AvatarV2Props = { src?: string | File | null; name?: string | null; sx?: SxProps<Theme> };

export const AvatarV2 = ({ src, name, sx }: AvatarV2Props) => {
  src = src ? src : undefined;
  name = name ? name : undefined;

  if (typeof src != "string" && src !== undefined) {
    src = URL.createObjectURL(src);
  }

  return (
    <Avatar src={src} sx={sx}>
      {!src && name ? name[0] : ""}
    </Avatar>
  );
};

/*
    Awatar na podstawie pliku lub tekstu
*/

export const ModalContentWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[500]}`,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  width: "85%",
  maxWidth: 550,
}));

/*
    Biały kontener z zawartością modala
*/

const SimpleModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[500]}`,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  width: "85%",
  maxWidth: 550,
}));

/*
    Prosty modal z białym kontenerem i listą przycisków na dole
*/

export type SimpleModalProps = Omit<ModalProps, "children"> & {
  buttons: (ButtonProps & { label: string })[];
  primarytext: React.ReactNode;
  secondarytext?: React.ReactNode;
  children?: React.ReactNode;
};

export const SimpleModal = (props: SimpleModalProps) => {
  const defaultStyles: SxProps<Theme> = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Modal {...props} sx={defaultStyles}>
      <SimpleModalContent width="85%" maxWidth="500px" display="flex" flexDirection="column" gap={1}>
        {/* <FocusTrap open> */}
        <>
          <Typography fontWeight={500} fontSize={22}>
            {props.primarytext}
          </Typography>
          {props.secondarytext && (
            <Typography fontSize={14} color={(theme) => theme.palette.grey[700]}>
              {props.secondarytext}
            </Typography>
          )}
          <Divider />

          {props.children}

          <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap={1} mt={2}>
            {props.buttons.map((buttonProps, index) => (
              <Button key={`modal-button-${index}`} variant="contained" {...buttonProps}>
                {buttonProps.label}
              </Button>
            ))}
          </Box>
        </>
        {/* </FocusTrap> */}
      </SimpleModalContent>
    </Modal>
  );
};

/*
    Input na pliki z podglądem
*/

export type FileInputProps = {
  file: File | string | null | undefined;
  textToRepleceFile?: string;
  onFileClear: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme>;
};

export const FileInput = ({ file, textToRepleceFile, onFileChange, onFileClear, sx }: FileInputProps) => {
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
            <input type="file" hidden onChange={onFileChange} />
          </IconButton>
        )}
      </Fab>
    </Box>
  );
};
