import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"; // Import the necessary Firebase functions

import {
    Button, TextField, Paper, Typography, Container,
    CssBaseline, Link, Box, Avatar, FormControl, Grid
} from "@mui/material";
import {
    getCurrentMonth, getCurrentDay, getCurrentYear,
    printDate, printThisDate, printTime, printThis12Time,
    printThis24Time, isThisCurrent
} from "./date_functions";
let userPresentInDatabase = 0;
const Profile = () => {
    const [user, setUser] = useState(null);
    const [userPresentInDatabase, setUserPresentInDatabase] = useState(false);
    const [userInserted, setUserInserted] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordUpdateError, setPasswordUpdateError] = useState(null);
    let [passwordUpdatedMessage, setPasswordUpdatedMessage] = useState('');
    const [saveClicked, setSaveClicked] = useState(false); // Track if "Save" button has been clicked

    const [error, setError] = useState(''); // Define the error state variable


    const handlePasswordUpdate = async () => {
        //compare fields
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/;

        // complexity check
        if (!passwordRegex.test(newPassword)) {
            setError("Password must contain at least 12 characters, including one uppercase letter, one lowercase letter, and one number.");
            return;
        }


        
        try {
            // Reauthenticate the user with their current password
            const credentials = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credentials);
    
            // User re-authenticated, proceed to update the password
            await updatePassword(user, newPassword);
            setPasswordUpdateError(null); // Clear any previous errors
            setNewPassword('');
            setConfirmNewPassword('');
            setError('');
            setSaveClicked(true);

            setPasswordUpdatedMessage = "Success!";
            //passwordUpdatedMessage = "Password Updated Successfully.";
        } catch (error) {
            console.error("Error during reauthentication or password update:", error);
            if (error.code === "auth/invalid-login-credentials") {
                setError("Incorrect password. Please try again.");
            } else {
                setError("An error occurred. Please try again later.");
            }
        }
        


    };
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
            <Box sx={{ mt: 10, ml: 5 }}>
                <Typography variant="h10">Date: {printDate()}</Typography>
                <Typography variant="h10">Time: {printTime()}</Typography>
                <Typography variant="h3">--------------------------------------</Typography>

                <Grid container spacing={2}>
                    <FormControl>
                        <Grid container>
                            <Grid item xs={3.4}>
                                <Typography variant="h6"> Email: {user?.email}</Typography>
                            </Grid>

                        </Grid>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography variant="h10">Current Password</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h10">New Password</Typography>
                            </Grid>
                            <Grid item xs={4}>
                            <Typography variant="h10">Confirm New Password</Typography>
                            </Grid>
                        </Grid>
                        
                        <Grid container>
                            <TextField
                                type="password"
                                label="************"
                                id="CurrentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <TextField
                                type="password"
                                label="************"
                                id="NewPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <TextField
                                type="password"
                                id="ConfirmNewPassword"
                                label="************"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
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
                            <Grid item xs={3.4} />

                            <Grid item xs={3.8}>
                                <Button variant="contained" color="primary" onClick={handlePasswordUpdate}>
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={3.8}>
                                <Button variant="contained" color="primary">
                                    Cancel
                                </Button>

                            </Grid>
                        </Grid>
                    </FormControl>
                </Grid>

            </Box>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!error && saveClicked && (
                <p style={{ color: "green" }}>Password Updated Successfully.</p>
            )}
        </CssBaseline>
    );
};

export default Profile;