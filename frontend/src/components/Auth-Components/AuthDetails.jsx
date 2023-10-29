import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Button, Typography, Container, CssBaseline, Box} from "@mui/material";

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
        setTimeout(function(){window.location.href = "http://localhost:3000/SignIn"}, 3000);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {authUser ? (
        // If there is an authenticated user, display user details and a sign-out button
        <>
        <CssBaseline>
          <Container>
            <Box textAlign={"center"} sx={{margin: "30vh auto  ", width: "45%"}}>
              <Typography textAlign={"center"} variant={"h4"}>{`Signed In as ${authUser.email}`}</Typography>
              <Button sx={{ mt: 3, mb: 2}} variant="contained" onClick={userSignOut}>Sign Out</Button>
            </Box>
          </Container>
          </CssBaseline>
        </>
      ) : (
        // If there is no authenticated user, display a "Signed Out" message
        <p>You are Not Signed In</p>
      )}
    </div>
  );
};

export default AuthDetails;
