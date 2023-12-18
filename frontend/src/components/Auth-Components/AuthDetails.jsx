import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Button, Typography, Container, CssBaseline, Box, Paper} from "@mui/material";

const AuthDetails = () => {
  // State variable to hold the authenticated user
  const [authUser, setAuthUser] = useState(null);

  // Use the useEffect hook to listen for changes in the user's authentication state
  useEffect(() => {
    // Set up an event listener for authentication state changes
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If a user is authenticated, update the authUser state with user data
        setAuthUser(user);
      } else {
        // If there is no authenticated user, set authUser to null
        setAuthUser(null);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      listen();
    };
  }, []);

  // Function to sign the user out
  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        setTimeout(function(){window.location.href = "/SignIn"}, 3000);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div>
      <CssBaseline>
        {authUser ? (
          // If there is an authenticated user, display user details and a sign-out button
          
            <Box display="flex" flexDirection="column" alignItems="center" sx={{height: "100vh", width: "100vw"}}>
              <Paper sx={{width: "40vw", margin: "auto", height: "40vh", borderRadius: 4}} elevation={12}>
                <Box display="flex" flexDirection="column" alignItems="center" sx={{minHeight: "40vh"}}>
                    <Box sx={{flexGrow: 1}} />
                    <Typography textAlign={"center"} variant={"h4"}>{`Signed In as ${authUser.email}`}</Typography>
                    <Button sx={{ mt: 3, mb: 2}} variant="contained" size="large" color={"purple"} onClick={userSignOut}>Sign Out</Button>
                    <Box sx={{flexGrow: 1}} />
                </Box>
              </Paper>
            </Box>
          ) : (
            // If there is no authenticated user, display a "Signed Out" message
            <Box display="flex" flexDirection="column" alignItems="center" sx={{height: "100vh", width: "100vw"}}>
              <Box sx={{flexGrow: 1}} />
              <Typography textAlign={"center"}variant="h3">Logging Out...</Typography>
              <Box sx={{flexGrow: 1}} />
            </Box>
          )}
        </CssBaseline>
      </div>
    </>
  );
};

export default AuthDetails;
