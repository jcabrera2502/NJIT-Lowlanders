import { onAuthStateChanged} from "firebase/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, Container, 
    CssBaseline, Link, Box, Avatar} from "@mui/material";
import { getCurrentMonth, getCurrentDay, getCurrentYear, 
    printDate, printThisDate, printTime, printThis12Time, 
    printThis24Time, isThisCurrent } from "./date_functions";

const Profile = () => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            fetchUserData(user);
        } else {
            setUser(null);
        }
        });
    }, []);

    // get data from backend from handler.js without using axios
    const [data, setData] = useState(null);
    const fetchUserData = async (user) => {
        const response = await axios.get("/api/email", {
            params: {
                email: user.email,
            }
        });
        //Only sets the data if there is a result
        if(response){
            setData(response.data);
        }
        
    };


    return (
        <CssBaseline>
            <Box sx={{mt: 10, ml: 5}}>
                <Typography variant="h4">Profile</Typography>
                <Typography variant="h6"> Email: {data?.email}</Typography>
                <Typography variant="h6"> Name: {data?.firstName + " " + data?.lastName}</Typography>
                <Typography variant="h6"> Phone: {data?.phone}</Typography>
                <Typography variant="h6"> Photo: {data?.photo}</Typography>
                <Typography variant="h6"> Date: {printDate()}</Typography>
                <Typography variant="h6"> Time: {printTime()}</Typography>
            </Box>
        </CssBaseline>
    );
    }

export default Profile;