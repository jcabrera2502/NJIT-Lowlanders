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
    
    const date = new Date();
    var dateFormatted;
    if (true /*MonthDayYear*/) {
        dateFormatted = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    } else if (true /*DayMonthYear*/) {
        dateFormatted = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }
    var time;
    if (true /*Twelve*/) {
        if (date.getHours() > 12) {
            time = (date.getHours() - 12) + ":" + date.getMinutes() + " pm"; 
        }
        else if (date.getHours() === 12) {
            time = date.getHours() + ":" + date.getMinutes() + " pm";
        }
        else if (date.getHours() === 0) {
            time = "12:" + date.getMinutes() + " am";
        }
        else {
            time = date.getHours() + ":" + date.getMinutes() + " am";
        }
    } else /*TwentyFour*/ {
        time = date.getHours() + ":" + date.getMinutes();
    }
    return (
        <CssBaseline>
            <Box sx={{mt: 10, ml: 5}}>
                <Typography variant="h4">Profile</Typography>
                <Typography variant="h6"> Email: {user?.email}</Typography>
                <Typography variant="h6"> Name: {user?.displayName}</Typography>
                <Typography variant="h6"> Phone: {user?.phoneNumber}</Typography>
                <Typography variant="h6"> Photo: {user?.photoURL}</Typography>
                <Typography variant="h6"> Date: {dateFormatted}</Typography>
                <Typography variant="h6"> Time: {time}</Typography>
            </Box>
        </CssBaseline>
    );
    }

export default Profile;