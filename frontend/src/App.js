import React from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from './Components/Auth-Components/SignIn';
import SignUp from './Components/Auth-Components/SignUp';
import AuthDetails from './Components/Auth-Components/AuthDetails';
import Home from './Components/Central-Components/Home';
import Nav from './Components/Nav';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


var userLoginStatus = false;
function checkLoginStatus()
{
  if (localStorage.getItem('token') === null)
  {
    userLoginStatus = false;
  }
  else
  {
    userLoginStatus = true;
  }
}
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;