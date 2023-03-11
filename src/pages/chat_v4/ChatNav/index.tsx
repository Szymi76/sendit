import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SettingsIcon from "@mui/icons-material/Settings";
import { AppBar, Box, styled } from "@mui/material";

import logout from "../../../firebase/utils/logout";
import { IconAsButton } from "../components";
import { NAV_SPACING } from "../constants";
import { useStates } from "../states";

const ChatNav = () => {
  const isChatListVisible = useStates((state) => state.isChatListVisible);
  const changeCreateNewChatVisibilityTo = useStates((state) => state.changeCreateNewChatVisibilityTo);
  const chnageChatListVisibilityTo = useStates((state) => state.chnageChatListVisibilityTo);
  const isCreateNewChatVisible = useStates((state) => state.isCreateNewChatVisible);

  const toggleChatListVisibilityTo = () => chnageChatListVisibilityTo(!isChatListVisible);
  const toggleCreateNewChatVisibilityTo = () => changeCreateNewChatVisibilityTo(!isCreateNewChatVisible);

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
          fabProps={{ variant: "transparent" }}
        />
        <IconAsButton
          icon={<SettingsIcon color="secondary" />}
          title="Ustawienia"
          fabProps={{ variant: "transparent" }}
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
