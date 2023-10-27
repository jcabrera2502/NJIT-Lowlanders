import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";

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
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {authUser ? (
        // If there is an authenticated user, display user details and a sign-out button
        <>
          <p>{`Signed In as ${authUser.email}`}</p>
          <button onClick={userSignOut}>Sign Out</button>
        </>
      ) : (
        // If there is no authenticated user, display a "Signed Out" message
        <p>You are Not Signed In</p>
      )}
    </div>
  );
};

export default AuthDetails;
