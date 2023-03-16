import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { LoadingButton } from "@mui/lab";
import { Link, Typography } from "@mui/material";
import { Box, styled, TextField, TextFieldProps } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link as RoterLink } from "react-router-dom";

import useRegisterUser from "../../firebase/hooks/useRegisterUser";

const defaultValues = { displayName: "", email: "", password: "", passwordRepeat: "" };

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues });

  const [registerUser, { isLoading, error }] = useRegisterUser();

  const onSubmit: SubmitHandler<typeof defaultValues> = async (data) => {
    const { displayName, email, password } = data;
    await registerUser({ displayName, email, password });
  };

  return (
    <Wrapper py={10}>
      <Main maxWidth="md">
        <Photo src="https://picsum.photos/500/800" alt="Dużo kolorowych parasoli" />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h4" fontWeight={700} mb={3} width="100%">
            Stwórz konto
          </Typography>
          <Controller
            name="displayName"
            control={control}
            rules={{
              required: { value: true, message: "Pole jest wymagane" },
              minLength: { value: 3, message: "Twoja nazwa jest za krótka" },
              maxLength: { value: 14, message: "Twoja nazwa jest za długa" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Twój nick"
                error={Boolean(errors.displayName?.message)}
                helperText={errors.displayName?.message ?? ""}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: { value: true, message: "Pole jest wymagane" } }}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                label="Adres email"
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message ?? ""}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: { value: true, message: "Pole jest wymagane" },
              minLength: { value: 5, message: "Hasło jest za krótkie" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                label="Hasło"
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message ?? ""}
              />
            )}
          />
          <Controller
            name="passwordRepeat"
            control={control}
            rules={{
              required: { value: true, message: "Pole jest wymagane" },
              validate: (value) => {
                if (watch("password") != value) return "Hasło nie są takie same";
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                label="Potówrz hasło"
                error={Boolean(errors.passwordRepeat?.message)}
                helperText={errors.passwordRepeat?.message ?? ""}
              />
            )}
          />
          <LoadingButton loading={isLoading} sx={{ width: "100%", mt: 5 }} variant="contained" type="submit">
            Dalej <TrendingFlatIcon sx={{ ml: 1 }} />
          </LoadingButton>
          <Typography width="100%" variant="subtitle2" mb={1} sx={{ color: "error.main" }}>
            {error?.message ?? ""}
          </Typography>
          <Link component={RoterLink} to="/zaloguj-sie">
            Masz już konto?
          </Link>
        </Form>
      </Main>
    </Wrapper>
  );
};

export default Register;

const Wrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[50],
}));

const Main = styled(Box)(({ theme }) => ({
  borderRadius: 5,
  minHeight: 550,
  backgroundColor: "white",
  width: "95%",
  margin: "0 auto",
  display: "flex",
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey[300]}`,
}));

const Photo = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Box position="relative" width="40%" display={{ xs: "none", md: "block" }}>
      <img width="100%" height="100%" src={src} alt={alt} style={{ objectFit: "cover" }} />
    </Box>
  );
};

const Form = (props: React.HTMLAttributes<HTMLFormElement>) => {
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

const Input = (props: TextFieldProps) => {
  return <TextField variant="standard" sx={{ width: "100%" }} {...props} />;
};
