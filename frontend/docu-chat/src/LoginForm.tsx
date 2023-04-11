import axios from "axios";
import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  TextField,
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginFormProps {
  onLogin: () => void;
}

const CardWrapper = styled(Card)({
  maxWidth: 400,
  margin: "auto",
  marginTop: 64,
  padding: 16,
});

const TextFieldWrapper = styled(TextField)({
  marginBottom: 16,
});

const ErrorTypography = styled(Typography)({
  color: "red",
  marginBottom: 16,
});

const ButtonWrapper = styled(Button)({
  marginTop: 16,
});

const ProgressWrapper = styled(CircularProgress)({
  marginLeft: 8,
});
export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8000/api/token/pair",
        { username, password }
      );
      localStorage.setItem("accessToken", response.data.access);
      onLogin();
    } catch (error) {
      console.error(error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <CardWrapper>
        <CardContent>
          <Typography variant="h5" component="h1" align="center">
            Login
          </Typography>
          <TextFieldWrapper
            label="Username"
            fullWidth
            value={username}
            onChange={handleUsernameChange}
          />
          <TextFieldWrapper
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {error && (
            <ErrorTypography variant="body2">
              {error}
            </ErrorTypography>
          )}
        </CardContent>
        <CardActions>
          <ButtonWrapper
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={loading}
          >
            Login
            {loading && <ProgressWrapper size={24} />}
          </ButtonWrapper>
        </CardActions>
      </CardWrapper>
    </Container>
  );
};

export default LoginForm;
