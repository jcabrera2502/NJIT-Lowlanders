import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth} from "../../firebase";
import { Button, Drawer, List, ListItem, Box, Avatar, AppBar, IconButton, 
         Toolbar, ListItemButton, ListItemText, Divider} 
         from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
//Only show Profile if the user is logged in
//Only show Settings if the user is logged in
//Only show Logout if the user is logged in

function Nav() {
    const [user, setUser] = useState(null);
    useEffect(() => {
    onAuthStateChanged(auth, (user) => 
    {
        if (user) 
        {
            setUser(user);
        } 
        else
        {
            setUser(null);
        }
    });
    }, []);

    //Side menu

    const [state, setState] = React.useState(false);

    // Side Menu toggle button
    const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
      }
      setState({ ...state, [anchor]: open });
    };

    // Side Menu list
    const list = (anchor) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List sx={{mt: 8}}>
            {['Testing1', 'Testing2', 'Testing3', 'Testing4'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Testing5', 'Testing6', 'Testing7'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      );

    return(
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <nav>
                    <Toolbar>
                        {user && <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={!state["left"] ? toggleDrawer("left", true) : toggleDrawer("left", false)}
                            >
                            <MenuIcon />
                        </IconButton>}
                        <Box sx={{flexGrow: 1}}></Box>
                        {user && <Button onClick={() => (window.location.href = "http://localhost:3000/")}>Home</Button>}
                        {user && <Button onClick={() => (window.location.href = "http://localhost:3000/TasksAppts")}>TasksAppts</Button>}
                        {!user && <Button onClick={() => (window.location.href = "http://localhost:3000/SignIn")}>SignIn</Button>}
                        {!user && <Button onClick={() => (window.location.href = "http://localhost:3000/SignUp")}>SignUp</Button>}
                        {user && <Button onClick={() => (window.location.href = "http://localhost:3000/AuthDetails")}>Logout</Button>}
                        {user && <IconButton onClick={() => (window.location.href = "http://localhost:3000/Profile")}><Avatar><AccountCircleIcon /></Avatar></IconButton>}
                        {user && <IconButton onClick={() => (window.location.href = "http://localhost:3000/Settings")}><SettingsIcon /></IconButton>}
                    </Toolbar>
                </nav>
            </AppBar>
            <Drawer
                    sx={{flexShrink: 0}}
                    anchor={"left"}
                    open={state["left"]}
                    onClose={toggleDrawer("left", false)}
                >
                {list("left")}
            </Drawer>
        </>
    );
}

export default Nav;