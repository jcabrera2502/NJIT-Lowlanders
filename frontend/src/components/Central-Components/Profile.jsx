import { onAuthStateChanged} from "firebase/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, Container, 
    CssBaseline, Link, Box, Avatar, FormControl, Grid} from "@mui/material";
import { getCurrentMonth, getCurrentDay, getCurrentYear, 
    printDate, printThisDate, printTime, printThis12Time, 
    printThis24Time, isThisCurrent } from "./date_functions";
    let userPresentInDatabase = 0;
const Profile = () => {
    const [user, setUser] = useState(null);
    const [userPresentInDatabase, setUserPresentInDatabase] = useState(false);
    const [userInserted, setUserInserted] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);
    useEffect(() => {
        if (user) {
            fetchUserData(user);
            insertUser(user);

        }
    }, [user]);
    // get data from backend from handler.js without using axios
    const [data, setData] = useState(null);
    const fetchUserData = async (user) => {
        if (!userPresentInDatabase) {
            const response = await axios.get("/api/email", {
                params: {
                    email: user.email,
                }
            });

            if (response) {
                setUserPresentInDatabase(true);
                console.log("User already in database");
                console.log(response.data);
                setData(response.data);
            }
        }
    };

    //function to insert a new user
    const insertUser = async (user) => {
        if (!userInserted) {
            try {
                const insertNewUser = await axios.post("/api/new", { email: user.email });
        
                if (insertNewUser) {            
                    setUserInserted(true);
                    console.log("User inserted into the database");
                    console.log(insertNewUser.data);
                }
              
            } catch (error) {
                console.log("GUFISE");
                console.error("An error occurred while making the POST request:", error);
            }
        }
    };

    //call an axios put request to update the user data
    const updateUserData = async () => {
            const response = await axios.put("/api/updateProfile", {
            params: 
            {
                email: "gcn5@njit.edu"
            }
        });
        //Only sets the data if there is a result
        if(response){
            console.log(response)
            setData(response.data);
        }
    };

    //write a cancel function to clear text inputs
    const cancelUserData = () => 
    {
        document.querySelector("#FirstName").value = "";
        document.querySelector("#LastName").value = "";
        document.querySelector("#CurrentPassword").value = ""
        document.querySelector("#NewPassword").value = ""
        document.querySelector("#ConfirmcurrentPassword").value = ""
        document.querySelector("#Pomodoro").value = "";
        document.querySelector("#ShortBreak").value = "";
        document.querySelector("#LongBreak").value = "";
    };

    function myFunction() {
        document.getElementById("FirstName").reset();
        console.log("reset");
    }

    return (
        <CssBaseline>
            <Box sx={{mt: 10, ml: 5}}>
                <Typography variant="h10"> Date: {printDate()}</Typography>
                <Typography variant="h10"> Time: {printTime()}</Typography>
                <Typography variant="h3"> --------------------------------------</Typography>
                <Grid container spacing={2}>
                <FormControl>
                    <Grid container>
                        <Grid item xs={3.4}>
                        <Typography variant="h6"> Email: {user?.email}</Typography>
                        </Grid>
                        <Grid item xs={3.8}>
                            <Typography variant="h10">First Name</Typography>
                        </Grid>
                        <Grid item xs={3.8}>
                            <Typography variant="h10"> Last Name </Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={3.4}>
                        </Grid>
                        <Grid item xs={3.8}>
                            <TextField placeholder={data?.firstName} defaultValue={data?.lastName} id='FirstName' onFocus=""> </TextField>
                        </Grid>
                        <Grid item xs={3.8}>
                            <TextField placeholder= {data?.lastName} defaultValue={data?.lastName} id='LastName'> </TextField>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={4}>
                            <Typography variant="h10"> Current Password</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h10"> New Password</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h10"> Confirm Password</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <TextField placeholder= "**********"  id="CurrentPassword"> </TextField>
                        <TextField placeholder= "**********"  id="NewPassword"> </TextField>
                        <TextField placeholder= "**********"  id="ConfirmcurrentPassword"> </TextField>
                    </Grid>
                    <Grid container>
                        <Grid item xs={4}>
                            <Typography variant="h10"> Pomodoro</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h10"> Short Break</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h10"> Long Break</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <TextField placeholder={data?.pomodoro} defaultValue={data?.pomodoro} id="Pomodoro"> </TextField>
                        <TextField placeholder={data?.shortBreak} defaultValue={data?.shortBreak} id="ShortBreak"> </TextField>
                        <TextField label={data?.longBreak} defaultValue={data?.longBreak} id="LongBreak"> </TextField>
                    </Grid>
                    <Grid container>
                        <Grid item xs={3.4}>
                        </Grid>
                        <Grid item xs={3.8}>
                            <Button variant="contained" color="primary" onClick={updateUserData}> Save </Button>
                        </Grid>
                        <Grid item xs={3.8}>
                            <Button variant = "contained" color="primary" onClick={cancelUserData}> Cancel </Button>
                        </Grid>
                    </Grid>
                </FormControl>
                </Grid>
            </Box>
        </CssBaseline>
    );
    }

export default Profile;