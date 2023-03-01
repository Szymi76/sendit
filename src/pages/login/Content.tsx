import { Box, styled, TextField, TextFieldProps } from "@mui/material";

// import CanyonImage from "../../assets/canyon.jpg";
// import MacbookImage from "../../assets/macbook.jpg";

// tło w postaci gradientu
export const Wrapper = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#FAACA8",
  backgroundImage: "linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)",
});

// kontent dla zdjęcia i formularza
export const Main = styled(Box)(({ theme }) => ({
  borderRadius: 5,
  minHeight: 550,
  backgroundColor: "white",
  width: "95%",
  margin: "0 auto",
  display: "flex",
  overflow: "hidden",
}));

// zdjęcie po lewej stronie
export const Photo = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Box position="relative" width="40%" display={{ xs: "none", md: "block" }}>
      <img width="100%" height="100%" src={src} alt={alt} style={{ objectFit: "cover" }} />
    </Box>
  );
};

// formularz po prawej stronie
export const Form = (props: React.HTMLAttributes<HTMLFormElement>) => {
  return (
    <Box width={{ xs: "100%", md: "60%" }}>
      <Box width={{ xs: "90%", sm: "60%", md: "65%" }} mx="auto">
        <form
          {...props}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20% 0",
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
