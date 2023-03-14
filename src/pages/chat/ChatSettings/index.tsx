import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Alert, Box, Snackbar, styled, SwipeableDrawer, Typography } from "@mui/material";
import { useState } from "react";

import AvatarV2 from "../../../components/AvatarV2";
import IconAsButton from "../../../components/IconAsButton";
import useChat from "../../../hooks/useChat";
import useToggle from "../../../hooks/useToggle";
import { CHAT_ROOM_HEADER_SPACING, CHAT_SETTINGS_WIDTH, NAV_SPACING } from "../constants";
import { useStates } from "../states";
import Participants from "./components/Participants";
import DeleteChatDialog from "./dialogs/DeleteChatDialog";
import LeaveChatDialog from "./dialogs/LeaveChatDialog";
import ManageChatUsersDialog from "./dialogs/ManageChatUsersDialog";
import UpdateChatDialog from "./dialogs/UpdateChatDialog";

const ChatSettings = () => {
  const [isDeleteChatDialogVisible, toggleDeleteChatDialogVisibility] = useToggle();
  const [isUpdateChatDialogVisible, toggleUpdateChatDialogVisibility] = useToggle();
  const [isManageUsersDialogVisible, toggleManageUsersDialogVisibility] = useToggle();
  const [isLeaveChatDialogVisible, toggleLeaveChatDialogVisibility] = useToggle();

  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, text: "" });

  const isChatSettingsVisible = useStates((state) => state.isChatSettingsVisible);
  const changeChatSettingsVisibilityTo = useStates((state) => state.changeChatSettingsVisibilityTo);
  const currentChat = useChat((state) => state.currentChat)!;
  const getChatName = useChat((state) => state.getChatName);
  const currentUser = useChat((state) => state.currentUser)!;
  const getUserRole = useChat((state) => state.getUserRole)!;

  const onClose = () => changeChatSettingsVisibilityTo(false);
  const onOpen = () => changeChatSettingsVisibilityTo(true);

  const prettyChatType = currentChat.type == "group" ? "grupowy" : "indywidualny";
  const currentUserRole = getUserRole(currentUser.uid, currentChat.id);
  const fabSx = { boxShadow: "none" };

  const handleSnackbarClose = () => setErrorSnackbar({ ...errorSnackbar, open: false });

  const handleOpenLeaveChatDialog = () => {
    if (currentUserRole == "owner") return setErrorSnackbar({ open: true, text: "Nie możesz opuścić własnego czatu" });
    toggleLeaveChatDialogVisibility(true);
  };

  const handleOpenDeleteChatDialog = () => {
    if (currentUserRole == "owner") return toggleDeleteChatDialogVisibility(true);
    setErrorSnackbar({ open: true, text: "Tylko twórca może usunąć czat" });
  };

  const handleOpenUpdateChatDialog = () => {
    if (currentUserRole == "user") return setErrorSnackbar({ open: true, text: "Nie masz dostępu do tej opcji" });
    toggleUpdateChatDialogVisibility(true);
  };

  const handleOpenManageUsersDialog = () => {
    if (currentUserRole == "user") return setErrorSnackbar({ open: true, text: "Nie masz dostępu do tej opcji" });
    toggleManageUsersDialogVisibility(true);
  };

  return (
    <>
      <Wrapper open={isChatSettingsVisible} variant="persistent" anchor="right" onOpen={onOpen} onClose={onClose}>
        <Header>
          <IconAsButton
            icon={<CloseIcon fontSize="large" />}
            title="Zamknij"
            fabProps={{ variant: "transparent", onClick: onClose }}
          />
        </Header>
        <Content>
          <AvatarV2 name={currentChat.name} src={currentChat.photoURL} sx={{ height: 175, width: 175 }} />

          <Typography variant="h4" fontWeight={500}>
            {getChatName(currentChat)}
          </Typography>

          <Typography display="flex" alignItems="center" gap={1} color="gray">
            <ChatIcon /> Rodzaj czatu - {prettyChatType}
          </Typography>

          <Participants />

          {currentChat.type == "group" && (
            <Footer>
              <IconAsButton
                icon={<ManageAccountsIcon />}
                title="Zarządzaj użytkownikami"
                fabProps={{ sx: fabSx, color: "info", onClick: handleOpenManageUsersDialog }}
              />
              <IconAsButton
                icon={<EditIcon />}
                title="Zmień informacje czatu"
                fabProps={{ sx: fabSx, color: "success", onClick: handleOpenUpdateChatDialog }}
              />
              <IconAsButton
                icon={<LogoutIcon />}
                title="Opuść czat"
                fabProps={{ sx: fabSx, color: "warning", onClick: handleOpenLeaveChatDialog }}
              />
              <IconAsButton
                icon={<DeleteIcon />}
                title="Usuń czat"
                fabProps={{ sx: fabSx, color: "error", onClick: handleOpenDeleteChatDialog }}
              />
            </Footer>
          )}
        </Content>

        <DeleteChatDialog open={isDeleteChatDialogVisible} onClose={toggleDeleteChatDialogVisibility} />
        <UpdateChatDialog open={isUpdateChatDialogVisible} onClose={toggleUpdateChatDialogVisibility} />
        <ManageChatUsersDialog open={isManageUsersDialogVisible} onClose={toggleManageUsersDialogVisibility} />
        <LeaveChatDialog open={isLeaveChatDialogVisible} onClose={toggleLeaveChatDialogVisibility} />
      </Wrapper>
      <Snackbar open={errorSnackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }} variant="filled">
          {errorSnackbar.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatSettings;

const Wrapper = styled(SwipeableDrawer)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  zIndex: 1100,
}));

const Content = styled(Box)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    width: "90vw",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  [theme.breakpoints.up("sm")]: {
    width: CHAT_SETTINGS_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const Header = styled(Box)(({ theme }) => ({
  height: theme.spacing(CHAT_ROOM_HEADER_SPACING),
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: theme.spacing(NAV_SPACING),
  padding: theme.spacing(2),
}));

export const Footer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  flex: 1,
  flexWrap: "wrap",
}));
