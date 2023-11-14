import React from 'react';
import SignIn from './components/Auth-Components/SignIn';
import SignUp from './components/Auth-Components/SignUp';
import AuthDetails from './components/Auth-Components/AuthDetails';
import Home from './components/Central-Components/Home';
import Settings from './components/Central-Components/Settings';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Profile from './components/Central-Components/Profile';
import { createTheme, ThemeProvider} from "@mui/material/styles";

const theme = createTheme({
  palette:
  {
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
  }
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
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