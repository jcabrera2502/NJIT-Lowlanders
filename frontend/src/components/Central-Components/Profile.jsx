import { onAuthStateChanged} from "firebase/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, Container, 
    CssBaseline, Link, Box, Avatar} from "@mui/material";

const paperStyle =
{
    padding: 30,
    height: "80vh",
    width: "45%",
    margin: "110px auto"
};

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
            time = (date.getHours() - 12) + ":" + String("0" + date.getMinutes()).slice(-2) + " pm"; 
        }
        else if (date.getHours() === 12) {
            time = date.getHours() + ":" + String("0" + date.getMinutes()).slice(-2) + " pm";
        }
        else if (date.getHours() === 0) {
            time = "12:" + String("0" + date.getMinutes()).slice(-2) + " am";
        }
        else {
            time = date.getHours() + ":" + String("0" + date.getMinutes()).slice(-2) + " am";
        }
    } else /*TwentyFour*/ {
        time = date.getHours() + ":" + String("0" + date.getMinutes()).slice(-2);
    }

    // get data from backend from handler.js without using axios
    const [data, setData] = useState(null);
    const fetchUserData = async (user) => {
        const response = await axios.get("/email", {
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
            <Paper square={false} style={paperStyle}>
                <Typography variant="h4">Profile</Typography>
                <Typography variant="h6"> Email: {data?.email}</Typography>
                <Typography variant="h6"> Name: {data?.firstName + " " + data?.lastName}</Typography>
                <Typography variant="h6"> Phone: {data?.phone}</Typography>
                <Typography variant="h6"> Photo: {data?.photo}</Typography>
                <Typography variant="h6"> Date: {dateFormatted}</Typography>
                <Typography variant="h6"> Time: {time}</Typography>
            </Paper>
        </CssBaseline>
    );
    }

export default Profile;