import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { onAuthStateChanged } from "firebase/auth";
import { auth} from "../../firebase";
import { Button, TextField, Paper, Typography, Container, 
    CssBaseline, Box, Avatar, AppBar, IconButton, Toolbar} from "@mui/material";
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

    return(
        <AppBar position="fixed">
            <nav>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{flexGrow: 1}}></Box>
                    {user && <Button onClick={() => (window.location.href = "http://localhost:3000/")}>Home</Button>}
                    {!user && <Button onClick={() => (window.location.href = "http://localhost:3000/SignIn")}>SignIn</Button>}
                    {!user && <Button onClick={() => (window.location.href = "http://localhost:3000/SignUp")}>SignUp</Button>}
                    {user && <Button onClick={() => (window.location.href = "http://localhost:3000/AuthDetails")}>Logout</Button>}
                    {user && <IconButton onClick={() => (window.location.href = "http://localhost:3000/Profile")}><AccountCircleIcon /></IconButton>}
                    {user && <IconButton onClick={() => (window.location.href = "http://localhost:3000/Settings")}><SettingsIcon /></IconButton>}
                </Toolbar>
            </nav>
        </AppBar>
    );
}

export default Nav;