import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, Container, 
  CssBaseline, Link, Box, Avatar, Grid} from "@mui/material";
  import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/jcabrera2502/NJIT-Lowlanders">
        NJIT Lowlanders
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const paperStyle =
{
  padding: 30,
  height: "80vh",
  width: "45%",
  margin: "50px auto"
};

const SignUp = () => {
      // State variables for email, password, password confirmation, and error message

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state variable for password confirmation
  const [error, setError] = useState(null);

  const signUp = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    /*Firebase method to create new user */
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        window.location.href = "http://localhost:3000/";
        setError(null); // Clear the error message on successful sign-up

      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
    <CssBaseline>
        <Container>
          <Paper elevation={5} variant="elevation" square={false} style={paperStyle}>
            <form onSubmit={signUp}>
              <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <PersonAddAlt1Icon />
                </Avatar>
              </Box>
              <Typography variant="h3" textAlign={"center"}>Create Account</Typography>
              <TextField
                autoFocus
                margin = "normal"
                variant="standard"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              ></TextField>
              <TextField
                margin = "normal"
                variant="standard"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              ></TextField>
              <TextField
                margin = "normal"
                variant="standard"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              ></TextField>
              <Button sx={{ mt: 3, mb: 2 }} fullWidth type="submit" variant="contained">Sign Up</Button>
              <div>
              <Button disableRipple style={{backgroundColor: "transparent"}} type="button" onClick={() => (window.location.href = "http://localhost:3000/Signin")}> Already have an account? Sign In</Button>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </Paper>
        </Container>
      </CssBaseline>
    </>
  );
};

export default SignUp;
