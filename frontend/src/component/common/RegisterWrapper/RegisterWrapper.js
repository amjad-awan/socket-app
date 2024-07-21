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
import { register } from "../../../services/auth";
import { Link } from "react-router-dom";

const RegisterWrapper = () => {
  const [userData, setUserData ]= useState({
    name:"",
    email:"",
    password:""
  })
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange=(e)=>{
const {value, name}= e.target
setUserData((prev)=>({
  ...prev,
  [name]:value
}))
  }
  
  // const handleChange = (e) => {
  //   const { value, name } = e.target;
  //   setUserData((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // }
  const handleRegister = async () => {
    try {
      const res = await register(userData)
      console.log("res",res)
      if (res) {

        console.log(res)

      }
    } catch (error) {
      console.log(error)

    }

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
            id="name"
            name="name"
            value={userData.name}
            variant="outlined"
            maxWidth="full"
            onChange={handleChange}
            label="name"
          />
            <TextField
            id="email"
            name="email"
            value={userData.email}
            variant="outlined"
            maxWidth="full"
            onChange={handleChange}
            label="email"
          />
          <OutlinedInput
            id="password"
            maxWidth="full"
            variant="outlined"
            name="password"
            value={userData.password}
            onChange={handleChange}
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

      <Typography color="primary"  gutterBottom>
        <Link to="/login">
         have an account?. login

        </Link>
        </Typography>
    </Container>
  );
};

export default RegisterWrapper;
