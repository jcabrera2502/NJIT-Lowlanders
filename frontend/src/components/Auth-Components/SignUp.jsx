import { createUserWithEmailAndPassword, sendEmailVerification, UserCredential, onAuthStateChanged} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, Container, 
  CssBaseline, Link, Box, Avatar} from "@mui/material";
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
  margin: "110px auto"
};

const SignUp = () => {
  // State variables for email, password, password confirmation, and error message

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState(""); // New state variable for password confirmation
const [error, setError] = useState(null);
const [isEmailVerified, setIsEmailVerified] = useState(false);

const signUp = (e) => {
e.preventDefault();

if (password !== confirmPassword) {
  setError("Passwords do not match. Please try again.");
  return;
}
  // Password complexity requirements
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
  if (!passwordRegex.test(password)) {
    setError("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.");
    return;
  }
// Create the new user
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Send the verification email
// Send the verification email
sendEmailVerification(userCredential.user);

// Display a message to the user informing them that a verification email has been sent
alert(`A verification email has been sent to ${email}. Please click on the link in the email to verify your email address.`);


window.location.href = "http://localhost:3000/SignIn";  

// The user's email address is now verified.  redirect them to the main page.
if(!userCredential.user.emailVerified)
setError("You must verify your email to login.");
  
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
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Paper>
        </Container>
      </CssBaseline>
    </>
  );
};

export default SignUp;
