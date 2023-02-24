import { styled, TextField, TextFieldProps } from "@mui/material";
import { Box } from "@mui/system";

import MacbookImage from "../../assets/macbook.jpg";

// tło w postaci gradientu
export const Wrapper = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#FAACA8",
  backgroundImage: "linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)",
});

// kontent dla zdjęcia i formularza
export const Main = styled(Box)(({ theme }) => ({
  borderRadius: 5,
  height: 550,
  maxHeight: "80vh",
  backgroundColor: "white",
  width: "95%",
  margin: "0 auto",
  display: "flex",
  overflow: "hidden",
}));

// zdjęcie po lewej stronie
export const Photo = () => {
  return (
    <Box width="40%" display={{ xs: "none", sm: "block" }}>
      <img
        width="100%"
        height="100%"
        src={MacbookImage}
        alt="Woman writting on macbook"
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
};

// formularz po prawej stronie
export const Form = (props: React.HTMLAttributes<HTMLFormElement>) => {
  return (
    <Box width={{ xs: "100%", sm: "60%" }}>
      <Box width={{ xs: "90%", sm: "80%", md: "65%" }} mx="auto">
        <form
          {...props}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            paddingTop: "20%",
            height: "100%",
            gap: "8px",
            minWidth: "300px",
            margin: "0 auto",
          }}
        />
      </Box>
    </Box>
  );
};

// pole tekstowe w formularzu
export const Input = (props: TextFieldProps) => {
  return <TextField variant="standard" sx={{ width: "100%" }} {...props} />;
};
