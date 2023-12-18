import React from 'react';
import SignIn from './components/Auth-Components/SignIn';
import SignUp from './components/Auth-Components/SignUp';
import AuthDetails from './components/Auth-Components/AuthDetails';
import Home from './components/Central-Components/Home';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Profile from './components/Central-Components/Profile';
import { createTheme, ThemeProvider} from "@mui/material/styles";

function App() {

  // Dark theme logic
  if(!JSON.parse(localStorage.getItem(`theme`)))
  {
    localStorage.setItem(`theme`, JSON.stringify(false));
  }
  var darkTheme = "light";
  if((JSON.parse(localStorage.getItem(`theme`))) === true)
  {
    darkTheme = 'dark';
  }

  const theme = createTheme({
    palette:
    {
      mode: darkTheme,
      purple:
      {
        main: "#5779F4",
        contrastText: "#fff",
        light: "#E8EDFF",
      },
      menu:
      {
        main: "#6284FF",
      },
      gray:
      {
        main: "#252628",
        light: "#F5F7F9",
      },
      white:
      {
        main: "#FFF"
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: "#6284FF #6284FF33",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: "#6284FF33",
              borderRadius: 8,
              width: 8,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": { // scrolling bar
              borderRadius: 8,
              backgroundColor: "#6284FF",
              minHeight: 24,
              border: "3px solid #6284FF33" ,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
              backgroundColor: "#4D73FF",
            },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
              backgroundColor: "#4D73FF",
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#4D73FF",
            },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "#4D73FF",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/AuthDetails" element={<AuthDetails />} />
            <Route path="/Profile" element={ <Profile />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 