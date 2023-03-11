import SearchIcon from "@mui/icons-material/Search";
import { Box, styled, TextField, TextFieldProps } from "@mui/material";

const SearchTextField = (props: TextFieldProps) => {
  return (
    <Wrapper>
      <SearchIcon sx={{ position: "absolute", top: "50%", transform: "translate(50%,-50%)" }} />
      <Input {...props} inputProps={{ style: { padding: "12px 16px 12px 40px", color: "white" } }} />
    </Wrapper>
  );
};

export default SearchTextField;

const Wrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  padding: `0 ${theme.spacing(2)}`,
  marginTop: theme.spacing(2),
}));

const Input = styled(TextField)(({ theme }) => ({
  margin: "auto",
  backdropFilter: "brightness(120%)",
  color: theme.palette.common.white,
  outline: "none !important",
  borderRadius: "4px",
  overflow: "hidden",
  width: "100%",
}));
