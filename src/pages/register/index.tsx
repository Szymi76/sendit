import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { LoadingButton } from "@mui/lab";
import { Link, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link as RoterLink } from "react-router-dom";

// import UmbrellasImage from "../../assets/umbrellas.jpg";
import useRegisterUser from "../../firebase/hooks/useRegisterUser";
import * as Content from "../login/Content";

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
    <Content.Wrapper py={10}>
      <Content.Main maxWidth="md" sx={{ boxShadow: 4 }}>
        <Content.Photo src="https://picsum.photos/500/800" alt="Dużo kolorowych parasoli" />
        <Content.Form onSubmit={handleSubmit(onSubmit)}>
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
              <Content.Input
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
              <Content.Input
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
              <Content.Input
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
              <Content.Input
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
        </Content.Form>
      </Content.Main>
    </Content.Wrapper>
  );
};

export default Register;
