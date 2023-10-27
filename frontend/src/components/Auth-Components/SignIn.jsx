import React, { useState } from "react";
import {auth} from "../../firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
    <div className="sign-in-container">
      <form onSubmit={signIn}>
        <h1>Log In to your Account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Log In</button>
      </form>

      {!resetEmailSent ? (
        <div>
          <button onClick={handleForgotPassword}>Forgot Password?</button>
        </div>
      ) : (
        <div>
          <p>Password reset email sent. Check your email to reset your password.</p>
        </div>
      )}
    </div>
  );
};
export default SignIn;