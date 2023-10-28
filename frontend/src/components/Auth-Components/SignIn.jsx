import React, { useState } from "react";
import {auth} from "../../firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Button, TextField, Paper, Avatar, Typography, Grid, Container, 
         CssBaseline, AppBar, Link} from "@mui/material";

const paperStyle =
{
  padding: 20,
  height: "70vh",
  width: "280",
  margin: "20px auto"
};

const SignIn = () => {
    // State variables for email, password, password confirmation, and error message

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);


/*Firebase method is called to sign user in*/
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        window.location.href = "http://localhost:3000/";
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetEmailSent(true);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleClick = () => {
    window.location.href = "http://localhost:3000/";
  };


  return (
    <>
      <Container>
        <div className="sign-in-container">
          <Paper variant="elevation" square={false} style={paperStyle} >
          <form onSubmit={signIn}>
            <Typography>Log In to your Account</Typography>
            <TextField
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
            <TextField
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
            <Button variant="contained" type="submit">Log In</Button>
            <div>
            <Link variant="contained" type="button" onClick={() => (window.location.href = "http://localhost:3000/SignUp")}> Don't have an account? Sign Up</Link>
            </div>
          </form>
          

          {!resetEmailSent ? (
            <div>
              <Link variant="contained" onClick={handleForgotPassword}>Forgot Password?</Link>
            </div>
          ) : (
            <div>
              <p>Password reset email sent. Check your email to reset your password.</p>
            </div>
          )}
          </Paper>
        </div>
      </Container>
    </>
  );
};
export default SignIn;