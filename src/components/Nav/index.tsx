import ForumIcon from "@mui/icons-material/Forum";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, Link, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import useAuth from "../../firebase/hooks/useAuth";
import logout from "../../firebase/utils/logout";
import * as Content from "./Content";

const Nav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Content.Wrapper>
      <Typography
        variant="h5"
        color="white"
        fontWeight={600}
        sx={{ fontStyle: "italic", cursor: "pointer" }}
        onClick={() => navigate("/home")}
      >
        SENDIT
      </Typography>
      <Content.Actions>
        {user ? (
          <>
            <Content.Icon icon={<SearchIcon />} onClick={() => navigate("/search")} />
            <Content.Icon icon={<ForumIcon />} />
            <Content.Icon icon={<PersonIcon />} />
            <Content.Icon icon={<SettingsIcon />} />
            <Content.Icon icon={<LogoutIcon />} onClick={async () => await logout()} />
          </>
        ) : (
          <Link
            component={RouterLink}
            to="/zaloguj-sie"
            sx={{ color: "white", ":after": { backgroundColor: "white" } }}
          >
            Zaloguj się
          </Link>
        )}
      </Content.Actions>
    </Content.Wrapper>
  );
};

export default Nav;
