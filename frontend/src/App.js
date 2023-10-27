import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AuthDetails from './components/AuthDetails';
import Home from './components/Home';
import Nav from './components/Nav';
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