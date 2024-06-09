import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, Container, Typography } from "@material-ui/core";
import { Grid, TextField } from "@mui/material";

const RegisterWrapper = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = () => {
    setError("");

    const existingUsers = JSON.parse(localStorage.getItem("users")) || {};
    const userExists = existingUsers.username === username;

    if (userExists) {
      setError("Username already exists. Please choose a different username.");
      return;
    }

    const newUser = { id: uuidv4(), username, password };
    localStorage.setItem("users", JSON.stringify(newUser));
    window.location.href = "/login";
  };

  return (
    <Container maxWidth="sm">
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            marginBottom: "20px",
            gap: "20px",
          }}
        >
          <TextField
            id="username"
            value={username}
            variant="outlined"
            maxWidth="full"
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
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
        <Button
          variant="contained"
          maxWidth="full"
          color="primary"
          onClick={handleRegister}
        >
          Register
        </Button>
      </Grid>
    </Container>
  );
};

export default RegisterWrapper;
