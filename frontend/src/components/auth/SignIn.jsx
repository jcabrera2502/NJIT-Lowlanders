
import React, { useState } from "react";
import {auth} from "../../firebase"
import { signInWithEmailAndPassword } from "firebase/auth";
const SignIn = () => {
    // State variables for email, password, password confirmation

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


/*Firebase method is called to sign user in*/
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        alert(error.message);
      });
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
          onChange={(e) => setPassword(e.target.value)}></input>
        <button type = "submit"> Log In</button> </form></div>);
};
export default SignIn;