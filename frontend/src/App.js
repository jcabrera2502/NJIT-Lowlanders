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
import { grey, deepOrange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: deepOrange,
    divider: deepOrange[700],
    text: {
      primary: "#fff",
      secondary: grey[500],
    },
  },
});

function App() {

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