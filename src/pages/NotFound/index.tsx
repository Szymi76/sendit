import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography, styled } from "@mui/material";
import useAuth from "../../firebase/hooks/useAuth";

const NotFound = () => {
  const auth = useAuth();

  const linkText = auth.user ? "Wróć do czatu" : "Wróć do logowania";
  const linkTo = auth.user ? "/chat" : "/zaloguj-sie";

  return (
    <Wrapper>
      <Typography variant="h2" fontWeight={400}>
        Nie znaleziono strony
      </Typography>
      <Link fontSize={22} component={RouterLink} to={linkTo}>
        {linkText}
      </Link>
    </Wrapper>
  );
};

export default NotFound;

const Wrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(5),
}));
