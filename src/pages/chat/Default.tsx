import { Box, styled, Typography } from "@mui/material";

const Default = () => {
  return (
    <Wrapper>
      <Circle>
        <Text>SENDIT</Text>
      </Circle>
    </Wrapper>
  );
};

export default Default;

const Wrapper = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 44px)",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.grey[100],
}));

const Circle = styled(Box)(({ theme }) => ({
  height: 200,
  width: 200,
  border: `3px solid ${theme.palette.primary.main}`,
  borderRadius: 9999,
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontStyle: "italic",
  fontWeight: 600,
  fontSize: 30,
}));
