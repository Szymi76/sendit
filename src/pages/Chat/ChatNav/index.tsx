import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SettingsIcon from "@mui/icons-material/Settings";
import { AppBar, Box, styled } from "@mui/material";

import { useStates } from "../../../app/stores";
import IconAsButton from "../../../components/IconAsButton";
import { NAV_SPACING } from "../../../constants";
import logout from "../../../firebase/utils/logout";

// NAWIGATOR CZATU NA SAMEJ GÓRZE STRONY
const ChatNav = () => {
  const isChatListVisible = useStates((state) => state.isChatListVisible);
  const changeCreateNewChatVisibilityTo = useStates((state) => state.changeCreateNewChatVisibilityTo);
  const chnageChatListVisibilityTo = useStates((state) => state.chnageChatListVisibilityTo);
  const isCreateNewChatVisible = useStates((state) => state.isCreateNewChatVisible);
  const changeUserSettingsVisibility = useStates((state) => state.changeUserSettingsVisibility);
  const isUserSettingsVisible = useStates((state) => state.isUserSettingsVisible);
  const isSearchDialogVisible = useStates((state) => state.isSearchDialogVisible);
  const changeSearchDialogVisibility = useStates((state) => state.changeSearchDialogVisibility);

  const toggleChatListVisibilityTo = () => chnageChatListVisibilityTo(!isChatListVisible);
  const toggleCreateNewChatVisibilityTo = () => changeCreateNewChatVisibilityTo(!isCreateNewChatVisible);
  const toggleUserSettingsVisibilityTo = () => changeUserSettingsVisibility(!isUserSettingsVisible);
  const toggleSearchDialogVisibility = () => changeSearchDialogVisibility(!isSearchDialogVisible);

  const handleLogout = async () => logout();

  return (
    <Nav position="static">
      <IconAsButton
        icon={<MenuIcon color="secondary" />}
        title="Pokaż / Ukryj listę czatów"
        fabProps={{ variant: "transparent", onClick: toggleChatListVisibilityTo }}
      />
      <RightSideIconsWrapper>
        <IconAsButton
          icon={<AddCircleOutlineIcon color="secondary" />}
          title="Utwórz nowy czat"
          fabProps={{ variant: "transparent", onClick: toggleCreateNewChatVisibilityTo }}
        />
        <IconAsButton
          icon={<PersonSearchIcon color="secondary" />}
          title="Poszukaj znajomych"
          fabProps={{ variant: "transparent", onClick: toggleSearchDialogVisibility }}
        />
        <IconAsButton
          icon={<SettingsIcon color="secondary" />}
          title="Ustawienia"
          fabProps={{ variant: "transparent", onClick: toggleUserSettingsVisibilityTo }}
        />
        <IconAsButton
          icon={<LogoutIcon color="secondary" />}
          title="Wyloguj się"
          fabProps={{ variant: "transparent", onClick: handleLogout }}
        />
      </RightSideIconsWrapper>
    </Nav>
  );
};

export default ChatNav;

const Nav = styled(AppBar)(({ theme }) => ({
  height: theme.spacing(NAV_SPACING),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1),
}));

const RightSideIconsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0),
}));
