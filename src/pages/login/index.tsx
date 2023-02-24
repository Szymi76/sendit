import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { LoadingButton } from "@mui/lab";
import { Link, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link as RoterLink } from "react-router-dom";

import CanyonImage from "../../assets/canyon.jpg";
import useLoginUser from "../../firebase/hooks/useLoginUser";
import * as Content from "./Content";

const defaultValues = { email: "", password: "" };

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [loginUser, { isLoading, error }] = useLoginUser();

  const onSubmit: SubmitHandler<typeof defaultValues> = async (data) => {
    const { email, password } = data;
    await loginUser({ email, password });
  };

  return (
    <Content.Wrapper py={10}>
      <Content.Main maxWidth="md" sx={{ boxShadow: 4 }}>
        <Content.Photo src={CanyonImage} alt="Zdjęcie kanionu" />
        <Content.Form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h4" fontWeight={700} mb={3} width="100%">
            Zaloguj się
          </Typography>
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
            rules={{ required: { value: true, message: "Pole jest wymagane" } }}
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
          <LoadingButton loading={isLoading} sx={{ width: "100%", mt: 5 }} variant="contained" type="submit">
            Dalej <TrendingFlatIcon sx={{ ml: 1 }} />
          </LoadingButton>
          <Typography width="100%" variant="subtitle2" mb={1} sx={{ color: "error.main" }}>
            {error?.message ?? ""}
          </Typography>
          <Link component={RoterLink} to="/stworz-konto">
            Nie masz konta?
          </Link>
        </Content.Form>
      </Content.Main>
    </Content.Wrapper>
  );
};

export default Login;
