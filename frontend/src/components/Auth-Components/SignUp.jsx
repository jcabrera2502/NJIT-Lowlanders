import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";

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
    <div className="sign-in-container">
      <form onSubmit={signUp}>
        <h1>Create Account</h1>
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
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
        <button type="submit">Sign Up</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
