import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, Container, Typography } from "@material-ui/core";
import { Alert, Grid, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { loginUser } from "../../../services/auth";

const LoginWrapper = () => {
  const { login } = useAuth();
  const navigate=useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser({ password, email })
      console.log("res", res)
      if (res && res.statusCode) {
        login(res.user)
        navigate("/")
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container maxWidth="sm" >
      <Grid sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center"
      }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: "20px" }}>
            {" "}
            {error}
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "20px",
            gap: "20px",
            width: "100%"
          }}
        >
          <TextField
            id="email"
            value={email}
            variant="outlined"
            maxWidth="full"
            onChange={(e) => setEmail(e.target.value)}
            label="email"
          />
          <OutlinedInput
            id="password"
            maxWidth="full"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </Box>

        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
        <Typography color="primary" gutterBottom>
          <Link to="/register">
            Don't have account. create account

          </Link>
        </Typography>
      </Grid>

    </Container>
  );
};

export default LoginWrapper;
