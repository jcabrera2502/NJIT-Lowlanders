import { onAuthStateChanged} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, Container, 
    CssBaseline, Link, Box, Avatar} from "@mui/material";

const Profile = () => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
        });
    }, []);
    
    return (
        <CssBaseline>
            <Box sx={{mt: 8, ml: 4}}>
                <Typography variant="h3">Profile</Typography>
                <Typography> Email: {user?.email}</Typography>
                <Typography> Name: {user?.displayName}</Typography>
                <Typography> Phone: {user?.phoneNumber}</Typography>
                <Typography> Photo: {user?.photoURL}</Typography>
            </Box>
        </CssBaseline>
    );
    }

export default Profile;