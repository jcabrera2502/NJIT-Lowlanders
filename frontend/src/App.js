
import Profile from './Components/Central-Components/Profile';
import { createTheme, ThemeProvider} from "@mui/material/styles";
import Profile from './components/Central-Components/Profile';
import { createTheme, ThemeProvider, alpha} from "@mui/material/styles";
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

var tmode = "dark";
var colorPrim = "#1976d2";
var colorPriml = "#42a5f5";
var colorPrimd = "#1565c0";
var colorSec = "#9c27b0";
var colorSecl = "#ba68c8";
var colorSecd = "#7b1fa2";

if (data != null)
{
  tmode = data.theme;
  colorPrim = data.primary;
  colorPriml = alpha(colorPrim, 0.5);
  colorPrimd = alpha(colorPrim, 0.9);
  colorSec = data.secondary;
  colorSecl = alpha(colorSec, 0.5);
  colorSecd = alpha(colorSec, 0.9); 
}



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