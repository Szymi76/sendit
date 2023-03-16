import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { Box, styled, SwipeableDrawer, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useChat, useStates } from "../../../app/stores";
import FileInput from "../../../components/FileInput";
import IconAsButton from "../../../components/IconAsButton";
import { CHAT_ROOM_HEADER_SPACING, NAV_SPACING, USER_SETTINGS_WIDTH } from "../../../constants";
import updateUser from "../../../firebase/utils/updateUser";

export type ValuesTypes = { displayName: string; photoURL: string | File | null };

// DRAWER Z USTAWIENIAMI UŻYTKOWNIKA
const UserSettings = () => {
  const isUserSettingsVisible = useStates((state) => state.isUserSettingsVisible);
  const changeUserSettingsVisibility = useStates((state) => state.changeUserSettingsVisibility);
  const currentUser = useChat((state) => state.currentUser)!;
  const [values, setValues] = useState<ValuesTypes>({ displayName: "", photoURL: null });
  const [loading, setLoading] = useState(false);

  const onClose = () => changeUserSettingsVisibility(false);
  const onOpen = () => changeUserSettingsVisibility(true);

  const disabled = currentUser.displayName == values.displayName && currentUser.photoURL == values.photoURL;

  useEffect(() => {
    setValues({ displayName: currentUser.displayName, photoURL: currentUser.photoURL });
  }, [currentUser]);

  const handleSaveChanges = async () => {
    if (disabled) return;
    try {
      setLoading(true);
      await updateUser(values);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDisplayName = e.target.value;
    if (newDisplayName.length < 4 || newDisplayName.length > 15) return;
    setValues({ ...values, displayName: e.target.value });
  };

  const handlePhotoURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setValues({ ...values, photoURL: files[0] });
  };

  const handleClearFile = () => setValues({ ...values, photoURL: null });

  return (
    <SwipeableDrawer open={isUserSettingsVisible} onClose={onClose} onOpen={onOpen} anchor="right">
      <Header>
        <Typography variant="h4" fontWeight={500}>
          Ustawienia
        </Typography>
        <IconAsButton
          icon={<CloseIcon fontSize="large" />}
          title="Zamknij ustawienia"
          fabProps={{ variant: "transparent", onClick: onClose }}
        />
      </Header>
      <ContentWrapper>
        <Content>
          <TextField
            variant="standard"
            label="Twoja nazwa"
            value={values.displayName}
            onChange={handleDisplayNameChange}
          />
          <Box>
            <Label variant="caption">Zdjęcie profilowe</Label>
            <FileInput
              file={values.photoURL}
              onFileChange={handlePhotoURLChange}
              onFileClear={handleClearFile}
              textToRepleceFile={currentUser!.displayName}
            />
          </Box>
        </Content>
        <LoadingButton
          loading={loading}
          variant="contained"
          size="large"
          sx={{ m: 1 }}
          disabled={disabled}
          onClick={handleSaveChanges}
        >
          Zapisz
        </LoadingButton>
      </ContentWrapper>
    </SwipeableDrawer>
  );
};

export default UserSettings;

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: `${USER_SETTINGS_WIDTH}px`,
  maxWidth: "100vw",
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const Content = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(2),
  maxWidth: 450,
  flex: 1,
}));

const Header = styled(Box)(({ theme }) => ({
  height: theme.spacing(CHAT_ROOM_HEADER_SPACING),
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  marginTop: theme.spacing(NAV_SPACING),
}));

const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
}));
