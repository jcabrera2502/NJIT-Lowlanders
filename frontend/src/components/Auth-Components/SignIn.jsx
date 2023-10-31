import React, { useState } from "react";
import {auth} from "../../firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Button, TextField, Paper, Typography, Container, 
         CssBaseline, Link, Box, Avatar} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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
  margin: "110px auto"
};

const SignIn = () => {
    // State variables for email, password, password confirmation, and error message

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState(null);


/*Firebase method is called to sign user in*/
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        if(userCredential.user.emailVerified == false){
          setError("You must verify your email to login.");
          console.log("peepee")

        }
        else{console.log("HIHI");
        window.location.href = "http://localhost:3000/";}
        
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetEmailSent(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

 /* const handleClick = () => {
    window.location.href = "http://localhost:3000/";
  };
  */

  return (
    <>
    <CssBaseline>
        <Container>
          <Paper elevation={5} variant="elevation" square={false} style={paperStyle}>
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
            </Box>
              <form onSubmit={signIn}>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="h3" textAlign={"center"}>Log In to your Account</Typography>
                </Box>
                <TextField
                  margin = "normal"
                  variant="standard"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                  fullWidth
                />
                <TextField
                  margin = "normal"
                  variant="standard"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
                <Button 
                  sx={{ mt: 3, mb: 2 }} 
                  variant="contained" 
                  type="submit"
                  fullWidth
                >Log In</Button>
                <Button disableRipple style={{backgroundColor: "transparent"}} type="button" onClick={() => (window.location.href = "http://localhost:3000/SignUp")}>Don't have an account? Sign Up</Button>
              </form>
              {!resetEmailSent ? (
                <div>
                  <Button disableRipple style={{backgroundColor: "transparent"}} type="button" onClick={handleForgotPassword}>Forgot Password?</Button>
                </div>

              ) : (
                <div>
                  <Typography>Password reset email sent. Check your email to reset your password.</Typography>
                </div>

              )
            }
            {error && <p style={{ color: "red" }}>{error}</p>}

              <Copyright sx={{ mt: 8, mb: 4 }} />
            </Paper>
          </Container>
      </CssBaseline>
    </>
  );
};
export default SignIn;