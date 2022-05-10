import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as L } from "react-router-dom";
import axios from "axios";
import authSlice from "./store/auth/auth";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { BRDFProps } from "./compute/raytracer/brdf";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://ccsam.ru/">
        CCSAM
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export interface RegistrationProps {
  name: string,
  last_name: string,
  username: string,
  email:string,
  password: string,
  work: string,
  allowemail: boolean
}

const theme = createTheme();

export default function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("firstName");
    const sname = data.get("lastName");
    const email = data.get("email");
    const login = data.get("login");
    const password = data.get("password");
    const work = data.get("work");
    const allowemail = data.get("allowExtraEmails");
    const allowpriva = data.get("allowPrivacy");
    handleReg({
      name: name!.toString(),
      last_name: sname!.toString(),
      username: login!.toString(),
      email:email!.toString(),
      password: password!.toString(),
      work: work!.toString(),
      allowemail: Boolean(allowemail)
    })

  };
  const handleReg = (props: RegistrationProps) => {
    console.log(process.env.REACT_APP_API_URL);
    console.log(props)
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/register/`, props)
      .then((res) => {
        console.log(res);
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        //setMessage(err.response.data.detail.toString());
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Имя"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="login"
                  label="Логин"
                  name="login"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="work"
                  label="Род вашей деятельности"
                  name="work"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="allowExtraEmails" color="primary" />}
                  label="Я хочу получать рассылку о новых возможностях CCSAM и новых продуктах компании"
                />
                <FormControlLabel
                  control={<Checkbox required name={"allowPrivacy"} color="primary" />}
                  label="Я согласен на обработку своих данных"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Создать аккаунт
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <L to="/login">
                  Есть аккаунт? Войти
                </L>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
