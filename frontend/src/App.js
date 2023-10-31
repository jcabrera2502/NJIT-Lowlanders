import React from 'react';
import SignIn from './components/Auth-Components/SignIn';
import SignUp from './components/Auth-Components/SignUp';
import AuthDetails from './components/Auth-Components/AuthDetails';
import Home from './components/Central-Components/Home';
import Nav from './components/Central-Components/Nav';
import Settings from './components/Central-Components/Settings';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Profile from './components/Central-Components/Profile';
import { createTheme, ThemeProvider} from "@mui/material/styles";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
//give me full path of firebase
import { auth} from "./firebase";
import axios from "axios";

function App() 
{

  const [user, setUser] = useState(null);
  useEffect(() => {
  onAuthStateChanged(auth, (user) => 
  {
      if (user) 
      {
          setUser(user);
          fetchUserDataSettings(user);
          console.log("User", user);
      } 
      else
      {
          setUser(null);
      }
  });
  }, []);
  
  const [data, setData] = useState(null);
  const fetchUserDataSettings = async (user) => {
      const response = await axios.get("/settings", {
          params: {
              email: user.email,
          }
      });
      //Only sets the data if there is a result
      if(response){
          setData(response.data);
          console.log("Data", response.data);
      }
      
  };
// if Data is not null, then we can use it to set the theme
var colorPrim = "#1976d2";
if (data != null)
{
  colorPrim = data.primary;
}

const tmode = "dark";
const colorPriml = "#42a5f5";
const colorPrimd = "#1565c0";
const colorSec = "#9c27b0";
const colorSecl = "#ba68c8";
const colorSecd = "#7b1fa2";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
      mode: tmode,
      ...(tmode === "dark" ? {
        primary: {
        main: colorPrim,
        light: colorPriml,
        dark: colorPrimd,
      },
      secondary: {
        main: colorSec,
        light: colorSecl,
        dark: colorSecd,
      },
      button: createColor(colorPrim),
    } : {
      primary: {
        main: colorPrim,
        light: colorPriml,
        dark: colorPrimd,
      },
      secondary: {
        main: colorSec,
        light: colorSecl,
        dark: colorSecd,
      },
      button: createColor("#fff"),
    }),
  },
});

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/AuthDetails" element={<AuthDetails />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;