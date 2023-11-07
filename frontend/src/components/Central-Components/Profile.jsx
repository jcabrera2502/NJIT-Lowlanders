import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, 
    CssBaseline, Divider, Box, Avatar, FormControl, Grid, AppBar, Toolbar,
    IconButton} from "@mui/material";
import WebIcon from "../../Images/Logo.svg";
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"; // Import the necessary Firebase functions

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
        updateUserData();
        //compare fields
        if (currentPassword === "")
        {
            return;
        }
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

    const updateUserData = async () => {
        console.log(user);
        if (document.querySelector("#FirstName").value === "")
        {
            var firstNameVal = data?.firstName;
        }
        else
        {
            firstNameVal = document.querySelector("#FirstName").value;
        }
        if (document.querySelector("#LastName").value === "")
        {
            var lastNameVal = data?.firstName;
        }
        else
        {
            lastNameVal = document.querySelector("#LastName").value;
        }
        if (document.querySelector("#Pomodoro").value === "")
        {
            var pomodoroVal = data?.pomodoro;
        }
        else
        {
            pomodoroVal = document.querySelector("#Pomodoro").value;
        }
        if (document.querySelector("#ShortBreak").value === "")
        {
            var shortBreakVal = data?.shortBreak;
        }
        else
        {
            shortBreakVal = document.querySelector("#ShortBreak").value;
        }
        if (document.querySelector("#LongBreak").value === "")
        {
            var longBreakVal = data?.longBreak;
        }
        else
        {
            longBreakVal = document.querySelector("#LongBreak").value;
        }
            const response = await axios.put("/api/updateProfile", {
            params: 
            {
                email: data?.email,
                firstName: firstNameVal,
                lastName: lastNameVal,
                pomodoro: pomodoroVal,
                shortBreak: shortBreakVal,
                longBreak: longBreakVal,     
            } 
        });
        //Only sets the data if there is a result
        if(response){ 
            console.log(response)
            setData(response.data);
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
            {/* Nav bar on the top and crush it on the left*/}
            <Grid container>
                <Grid item xs={1.64}>
                    <Box positions="left" textAlign={"center"} sx={{
                        color: '#FFFFFF',
                        background: '#252628',
                        height: "100vh",
                        width: '200px',
                        padding: "10px",
                    }}>
                        <div class="container-fluid">
                            <Typography sx ={{mt: 3, mb: 4}} variant="h4">Crush It</Typography>
                            <Divider variant="middle" color="#3E3F42" sx={{ height: 2, width: '160px' }} />
                            <Box textAlign={"center"} sx={{padding: "10px"}} >
                                <img src={WebIcon} width={148} height={148} alt="WebIcon" />
                            </Box>

                            <Box textAlign={"center"}>
                                <Typography textAlign={"center"} variant={"h5"}>{`It’s time to plan your day!`}</Typography>
                                    <Button sx={{ mt: 5, mb: 2, borderRadius: 3, width: 150, height: 50, border: "2px solid"}} color="white" variant="outlined">Plan Day</Button>
                            </Box>
                        </div>
                        
                        <Box sx={{mt: "32vh"}}>
                            <Button onClick={() => (window.location.href = "http://localhost:3000/AuthDetails")} sx={{ mt: 5, mb: 2, borderRadius: 3, border: "1px solid"}} color="white" variant="outlined"><LogoutOutlinedIcon sx={{width: 20, height: 20, mr: 1}}/>Log Out</Button>
                        </Box>
                    </Box>
                </Grid>
                    <AppBar elevation={12} color="white" sx={{width: `calc(100% - ${200}px)`}}>   
                        <Toolbar>
                            <Typography sx={{fontWeight: "bold"}}variant="h4">Profile</Typography>
                            <Box sx={{flexGrow: 1}}></Box>
                            <Button sx={{textTransform: "none"}} onClick={() => (window.location.href = "http://localhost:3000/Profile")}><Avatar sx={{bgcolor: "#E8EDFF"}}><PermIdentityRoundedIcon sx={{color: "#6284FF"}} /></Avatar><Typography sx={{fontWeight: "bold", color: "black", ml: 1}}>{data?.firstName} {data?.lastName}</Typography></Button>
                        </Toolbar>
                    </AppBar>
                {/* Page information*/}
                
                <Grid item xs={10}>
                    <Box sx={{mt: 12, width: "100%"}}>
                        <FormControl sx={{width: "100%"}}>

                            { /* User Info */ }
                            <Typography variant="h5" sx={{mb: 2, fontWeight: "bold"}}>User Info</Typography>
                            <Paper sx={{width: "100%", height: "15vh", borderRadius: 3}} elevation={12}>
                                <Box
                                    sx={{display: "flex", flexDirection: "row", ml: 3, mt: "2vh"}}
                                >
                                    <Typography sx={{flexGrow: 1}}><PermIdentityRoundedIcon color="purple" />First Name</Typography>
                                    <Typography sx={{flexGrow: 1}}><PermIdentityRoundedIcon color="purple" />Last Name</Typography>
                                </Box>
                                <Box
                                    sx={{display: "flex", flexDirection: "row"}}
                                >
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3, ml: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder={data?.firstName} 
                                        defaultValue={data?.firstName} 
                                        id='FirstName' onFocus=""> 
                                    </TextField>
                                    
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder={data?.lastName}
                                        defaultValue={data?.lastName} 
                                        id='LastName'> 
                                    </TextField>
                                </Box>
                            </Paper>

                            { /* Password info */ }
                            <Typography variant="h5" sx={{mb: 2, fontWeight: "bold", mt: "5vh"}}>Change Password</Typography>
                            <Paper sx={{width: "100%", height: "15vh", borderRadius: 3}} elevation={12}>
                                <Box
                                    sx={{display: "flex", flexDirection: "row", ml: 3, mt: "2vh"}}
                                >
                                    <Typography sx={{flexGrow: 1}}><LockOutlinedIcon color="purple" />Current Password</Typography>
                                    <Typography sx={{flexGrow: 1}}><LockOutlinedIcon color="purple" />New Password</Typography>
                                    <Typography sx={{flexGrow: 1}}><LockOutlinedIcon color="purple" />Confirm Password</Typography>
                                </Box>
                                <Box
                                    sx={{display: "flex", flexDirection: "row"}}
                                >
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3, ml: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder= "**********" 
                                        defaultValue={data?.lastName} 
                                        id='CurrentPassword'
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        type="password"
                                    > 
                                    </TextField>
                                    
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder= "**********"
                                        id="NewPassword"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        type="password" 
                                    > 
                                    </TextField>

                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder= "**********"
                                        id="ConfirmcurrentPassword"
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        type="password"
                                    > 
                                    </TextField>
                                </Box>
                            </Paper>

                            { /* Pomodoro Timer */ }
                            <Typography variant="h5" sx={{mb: 2, fontWeight: "bold",  mt: "5vh"}}>Pomodoro Timer (Minutes)</Typography>
                            <Paper sx={{width: "100%", height: "15vh", borderRadius: 3}} elevation={12}>
                                <Box
                                    sx={{display: "flex", flexDirection: "row", ml: 3, mt: "2vh"}}
                                >
                                    <Typography sx={{flexGrow: 1}}><AccessTimeOutlinedIcon color="purple" />Pomodoro</Typography>
                                    <Typography sx={{flexGrow: 1}}><AccessTimeOutlinedIcon color="purple" />Short Break</Typography>
                                    <Typography sx={{flexGrow: 1}}><AccessTimeOutlinedIcon color="purple" />Long Break</Typography>
                                </Box>
                                <Box
                                    sx={{display: "flex", flexDirection: "row"}}
                                >
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3, ml: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder={data?.pomodoro} 
                                        defaultValue={data?.pomodoro} 
                                        id='Pomodoro' onFocus=""> 
                                    </TextField>
                                    
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder={data?.shortBreak}
                                        defaultValue={data?.shortBreak} 
                                        id='ShortBreak'> 
                                    </TextField>

                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder={data?.longBreak}
                                        defaultValue={data?.longBreak} 
                                        id='LongBreak'> 
                                    </TextField>
                                </Box>
                            </Paper>

                            <Box 
                                sx={{mt: "4vh", width: "100%", height: "5vh"}}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Button color="purple" sx={{mr: 2, width: "18%", height: "6vh", borderRadius: 3, boxShadow: 12}} variant="outlined" onClick={cancelUserData}>Cancel</Button>
                                <Button color="purple" sx={{width: "18%", height: "6vh", borderRadius: 3, boxShadow: 12}} variant="contained" onClick={handlePasswordUpdate}>Save</Button>
                            </Box>
                        </FormControl>
                    </Box>
                    <Box 
                        sx={{mt: 3}}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {error && <Typography color="error">{error}</Typography>}
                        {!error && saveClicked && (<Typography color="success">Password Updated Successfully.</Typography>)}
                    </Box>
                </Grid>
            </Grid>
            
        </CssBaseline>
    );
};

export default Profile;