import { Box, CircularProgress, styled } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[100],
  display: "flex",
  justifyContent: "center",
  paddingTop: theme.spacing(10),
}));

const Loading = () => {
  return (
    <Wrapper>
      <CircularProgress size={50} />
    </Wrapper>
  );
};

export default Loading;
