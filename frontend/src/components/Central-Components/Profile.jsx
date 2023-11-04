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
                            <TextField label= {data?.firstName}> </TextField>
                        </Grid>
                        <Grid item xs={3.8}>
                            <TextField label= {data?.lastName}> </TextField>
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
                        <TextField label= "**********"> </TextField>
                        <TextField label= "**********"> </TextField>
                        <TextField label= "**********"> </TextField>
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
                        <TextField label={data?.pomodoro}> </TextField>
                        <TextField label={data?.shortBreak}> </TextField>
                        <TextField label={data?.longBreak}> </TextField>
                    </Grid>
                    <Grid container>
                        <Grid item xs={3.4}>
                        </Grid>
                        <Grid item xs={3.8}>
                            <Button variant="contained" color="primary"> Save </Button>
                        </Grid>
                        <Grid item xs={3.8}>
                            <Button variant = "contained" color="primary"> Cancel </Button>
                        </Grid>
                    </Grid>
                </FormControl>
                </Grid>
            </Box>
        </CssBaseline>
    );
    }

export default Profile;