import React, { useState } from "react";
import {auth} from "../../firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider,signInWithPopup  } from "firebase/auth";
import { Button, TextField, Paper, Typography, Grid, 
         CssBaseline, Link, Box, InputLabel} from "@mui/material";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Logo from '../../Images/Logo.svg';
import CrushIt from '../../Images/CrushIt.svg';

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
const authErrors = {
  
  "requires-recent-login": "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
  "dynamic-link-not-activated": "Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.",
  "email-change-needs-verification": "Multi-factor users must always have a verified email.",
  "auth/email-already-in-use": "The email address is already in use by another account.",
  "expired-action-code": "The action code has expired. ",
  "cancelled-popup-request": "This operation has been cancelled due to another conflicting popup being opened.",
  "internal-error": "An internal error has occurred.",
  "auth/invalid-login-credentials": "Your login credentials are incorrect.",
  "invalid-app-id": "The mobile app identifier is not registed for the current project.",
  "invalid-user-token": "This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.",
  "auth/invalid-auth-event": "An internal error has occurred.",
  "invalid-verification-code": "The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.",
  "invalid-continue-uri": "The continue URL provided in the request is invalid.",
  "invalid-cordova-configuration": "The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.",
  "invalid-custom-token": "The custom token format is incorrect. Please check the documentation.",
  "invalid-dynamic-link-domain": "The provided dynamic link domain is not configured or authorized for the current project.",
  "auth/invalid-email": "The email address is badly formatted.",
  "invalid-api-key": "Your API key is invalid, please check you have copied it correctly.",
  "invalid-cert-hash": "The SHA-1 certificate hash provided is invalid.",
  "invalid-credential": "The supplied auth credential is malformed or has expired.",
  "invalid-message-payload": "The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.",
  "invalid-multi-factor-session": "The request does not contain a valid proof of first factor successful sign-in.",
  "invalid-oauth-provider": "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.",
  "invalid-oauth-client-id": "The OAuth client ID provided is either invalid or does not match the specified API key.",
  "unauthorized-domain": "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
  "invalid-action-code": "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.",
  "auth/wrong-password": "The password is invalid or the user does not have a password.",
  "invalid-persistence-type": "The specified persistence type is invalid. It can only be local, session or none.",
  "invalid-phone-number": "The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
  "invalid-provider-id": "The specified provider ID is invalid.",
  "invalid-recipient-email": "The email corresponding to this action failed to send as the provided recipient email address is invalid.",
  "invalid-sender": "The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.",
  "invalid-verification-id": "The verification ID used to create the phone auth credential is invalid.",
  "invalid-tenant-id": "The Auth instance's tenant ID is invalid.",
  "multi-factor-info-not-found": "The user does not have a second factor matching the identifier provided.",
  "multi-factor-auth-required": "Proof of ownership of a second factor is required to complete sign-in.",
  "missing-android-pkg-name": "An Android Package Name must be provided if the Android App is required to be installed.",
  "auth-domain-config-required": "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.",
  "missing-app-credential": "The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.",
  "missing-verification-code": "The phone auth credential was created with an empty SMS verification code.",
  "missing-continue-uri": "A continue URL must be provided in the request.",
  "missing-iframe-start": "An internal error has occurred.",
  "missing-ios-bundle-id": "An iOS Bundle ID must be provided if an App Store ID is provided.",
  "missing-multi-factor-info": "No second factor identifier is provided.",
  "missing-multi-factor-session": "The request is missing proof of first factor successful sign-in.",
  "missing-or-invalid-nonce": "The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.",
  "missing-phone-number": "To send verification codes, provide a phone number for the recipient.",
  "missing-verification-id": "The phone auth credential was created with an empty verification ID.",
  "app-deleted": "This instance of FirebaseApp has been deleted.",
  "account-exists-with-different-credential": "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
  "network-request-failed": "A network error (such as timeout, interrupted connection or unreachable host) has occurred.",
  "no-auth-event": "An internal error has occurred.",
  "no-such-provider": "User was not linked to an account with the given provider.",
  "null-user": "A null user object was provided as the argument for an operation which requires a non-null user object.",
  "operation-not-allowed": "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.",
  "operation-not-supported-in-this-environment": 'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
  "popup-blocked": "Unable to establish a connection with the popup. It may have been blocked by the browser.",
  "popup-closed-by-user": "The popup has been closed by the user before finalizing the operation.",
  "provider-already-linked": "User can only be linked to one identity for the given provider.",
  "quota-exceeded": "The project's quota for this operation has been exceeded.",
  "redirect-cancelled-by-user": "The redirect operation has been cancelled by the user before finalizing.",
  "redirect-operation-pending": "A redirect sign-in operation is already pending.",
  "rejected-credential": "The request contains malformed or mismatching credentials.",
  "second-factor-already-in-use": "The second factor is already enrolled on this account.",
  "maximum-second-factor-count-exceeded": "The maximum allowed number of second factors on a user has been exceeded.",
  "tenant-id-mismatch": "The provided tenant ID does not match the Auth instance's tenant ID",
  "user-token-expired": "The user's credential is no longer valid. The user must sign in again.",
  "too-many-requests": "We have blocked all requests from this device due to unusual activity. Try again later.",
  "unauthorized-continue-uri": "The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.",
  "unsupported-first-factor": "Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.",
  "unsupported-persistence-type": "The current environment does not support the specified persistence type.",
  "unsupported-tenant-operation": "This operation is not supported in a multi-tenant context.",
  "unverified-email": "The operation requires a verified email.",
  "user-cancelled": "The user did not grant your application the permissions it requested.",
  "auth/user-not-found": "There is no user record corresponding to this identifier. The user may have been deleted.",
  "user-disabled": "The user account has been disabled by an administrator.",
  "auth/user-mismatch": "The supplied credentials do not correspond to the previously signed in user.",
  "user-signed-out": "",
  "auth/weak-password": "The password must be 6 characters long or more.",
  "web-storage-unsupported": "This browser is not supported or 3rd party cookies and data may be disabled."
}
const paperStyle =
{
  padding: 30,
  height: "80vh",
  width: "60%",
  marginLeft: "35%",
};

const SignIn = () => {
    // State variables for email, password, password confirmation, and error message

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState(null);


  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful Google sign-in
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle errors
        console.error(error.message);
      });
  };
/*Firebase method is called to sign user in*/
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        if(userCredential.user.emailVerified == false){
          setError("You must verify your email to login.");

        }
        else{
        window.location.href = "http://localhost:3000/";}
        
      })
      
      .catch((error) => {
        const errorCode = error.code;
        setError(authErrors[errorCode] || error.message);
        console.log(error.code);
        console.log(error.message);
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
        <Grid container sx={{height: "100vh"}}>
          <Grid item xs={6}>
            <Box 
              sx={{width: "148%", height: "100%", backgroundColor: "#252628"}}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <img src={CrushIt} alt="Crush It Logo"/>
              <img src={Logo} alt="Crush It Logo" width="700" height="700" /></Box>
          </Grid>
          <Grid item xs={6} sx={{mt: 14}}>
            <Paper 
              elevation={6} 
              variant="elevation" 
              square={false} 
              style={paperStyle}
              sx={{borderRadius: 2}}
            >
              <form onSubmit={signIn}>
                <Box sx={{ mt: 1, mb: 5 }}>
                  <Typography variant="h4" textAlign={"left"}>Sign In</Typography>
                </Box>
                <InputLabel shrink><MailOutlineIcon color="purple" sx={{height: 25, width: 25, mr: 1}} />Email/username</InputLabel>
                <TextField
                  variant="outlined"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                  fullWidth
                  sx={{mb: 3}}
                  InputProps={{ sx: {borderRadius: 2}}}
                />
                <InputLabel shrink><LockOutlinedIcon color="purple" sx={{height: 25, width: 25, mr: 1}} />Password</InputLabel>
                <TextField
                  variant="outlined"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  sx={{mb: 3}}
                  InputProps={{ sx: {borderRadius: 2}}}
                />
                <Box 
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{borderRadius: 2}}
                >
                  <Button 
                    sx={{ mt: 3, mb: 4, width: 225, height: 50, borderRadius: 3 }} 
                    variant="contained" 
                    type="submit"
                    color="purple"
                  >Log In</Button>
                </Box>
                <Box sx={{height: 125}}></Box>
              </form>
              {!resetEmailSent ? (
                <Box 
                  sx={{backgroundColor: "#F5F7F9", borderRadius: 2}}
                  display="flex"
                  justifyContent="left"
                  alignItems="left"
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <Button color="purple" disableRipple style={{backgroundColor: "transparent"}} type="button" onClick={() => (window.location.href = "http://localhost:3000/SignUp")}>Don't have an account? Sign Up</Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button color="purple" disableRipple style={{backgroundColor: "transparent"}} type="button" onClick={handleForgotPassword}>Forgot Password?</Button>
                    </Grid>
                  </Grid>
                </Box>

              ) : (
                <div>
                  <Typography>Password reset email sent. Check your email to reset your password.</Typography>
                </div>

              )
            }
            {error && <Typography style={{ color: "red" }}>{error}</Typography>}    
              </Paper>
            </Grid>
          </Grid>
      </CssBaseline>
    </>
  );
};
export default SignIn;