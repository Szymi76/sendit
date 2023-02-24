import { Box, styled } from "@mui/material";
import { ProgressBar } from "react-loader-spinner";

export const Wrapper = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#FAACA8",
  backgroundImage: "linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)",
  display: "flex",
  justifyContent: "center",
  paddingTop: 48,
});

const Loading = () => {
  return (
    <Wrapper>
      <ProgressBar height={100} width={200} barColor="#818cf8" borderColor="#818cf8" />
    </Wrapper>
  );
};

export default Loading;
