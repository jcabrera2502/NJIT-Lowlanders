import React from 'react';
import './App.css';
import SignIn from './Components/Auth-Components/SignIn';
import SignUp from './Components/Auth-Components/SignUp';
import AuthDetails from './Components/Auth-Components/AuthDetails';
import Home from './Components/Central-Components/Home';
import Nav from './Components/Nav';
import Settings from './Components/Central-Components/Settings';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/AuthDetails" element={<AuthDetails />} />
          <Route path="/Settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 