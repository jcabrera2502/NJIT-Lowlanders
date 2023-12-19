import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import React, { useEffect, useState, Component } from "react";
import { auth } from "../../firebase";
import { Button, TextField, Paper, Typography, 
    CssBaseline, Divider, Box, Avatar, FormControl, Grid, AppBar, Toolbar,
    Switch, Menu, MenuItem} from "@mui/material";
import { styled } from '@mui/material/styles';
import WebIcon from "../../Images/Logo.svg";
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"; // Import the necessary Firebase functions
import { storage, upload, useAuth } from "../../firebase";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";



const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 14 14"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M13.5228 7.85468C13.3812 7.81928 13.2396 7.85468 13.1157 7.94318C12.6555 8.33258 12.1245 8.65118 11.5404 8.86358C10.9917 9.07598 10.3899 9.18218 9.75272 9.18218C8.31901 9.18218 7.00921 8.59808 6.07111 7.65998C5.13301 6.72188 4.54891 5.41207 4.54891 3.97837C4.54891 3.37657 4.65511 2.79247 4.83211 2.26147C5.02681 1.69507 5.31001 1.18177 5.68171 0.739267C5.84101 0.544566 5.80561 0.261366 5.61091 0.102066C5.48701 0.0135654 5.34541 -0.0218346 5.20381 0.0135654C3.69931 0.420666 2.3895 1.32337 1.4514 2.52697C0.548701 3.71287 0 5.18197 0 6.79268C0 8.72198 0.778801 10.4743 2.0532 11.7487C3.32761 13.0231 5.07991 13.8019 7.00921 13.8019C8.63761 13.8019 10.1421 13.2355 11.3457 12.2974C12.567 11.3416 13.452 9.97868 13.8237 8.42108C13.9122 8.15558 13.7706 7.90778 13.5228 7.85468ZM10.8147 11.554C9.78812 12.3682 8.47831 12.8638 7.04461 12.8638C5.36311 12.8638 3.84091 12.1735 2.7435 11.0761C1.6461 9.97868 0.955802 8.45648 0.955802 6.77498C0.955802 5.37667 1.416 4.10227 2.2125 3.07567C2.7612 2.36767 3.45151 1.78357 4.24801 1.37647C4.15951 1.57117 4.07101 1.76587 4.00021 1.97827C3.77011 2.61547 3.66391 3.28807 3.66391 3.99607C3.66391 5.67757 4.35421 7.21748 5.45161 8.31488C6.54901 9.41228 8.08891 10.1026 9.77042 10.1026C10.5138 10.1026 11.2218 9.97868 11.8767 9.73088C12.1068 9.64238 12.3369 9.55388 12.5493 9.44768C12.1245 10.2619 11.5404 10.9876 10.8147 11.554Z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#333333',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#6284FF',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#6284FF35',
      borderRadius: 20 / 2,
    },
  }));

let userPresentInDatabase = 0;
const Profile = (props) => {
    const theme = JSON.parse(localStorage.getItem(`theme`));
    const [user, setUser] = useState(null);
    const [userPresentInDatabase, setUserPresentInDatabase] = useState(false);
    const [userInserted, setUserInserted] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordUpdateError, setPasswordUpdateError] = useState(null);
    let   [passwordUpdatedMessage, setPasswordUpdatedMessage] = useState('');
    const [saveClicked, setSaveClicked] = useState(false); // Track if "Save" button has been clicked

    const [error, setError] = useState(''); // Define the error state variable

    
    const handlePasswordUpdate = async () => {
        updateUserData();
        window.location.reload();
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
                //console.log("User already in database");
                //console.log(response.data);
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
        //console.log(user);
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
            var lastNameVal = data?.lastName;
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
            //console.log(response)
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
                    //console.log("User inserted into the database");
                    //console.log(insertNewUser.data);
                }

            } catch (error) {
                //console.log("GUFISE");
                console.error("An error occurred while making the POST request:", error);
            }
        }
    };

    //Profile Picture Change
        const [image, setImage] = useState(null);
        const [photoURL, setphotoURL] = useState(null);
        const currentUser = useAuth();
        const [loading, setLoading] = useState(false)

        const handleImageChange = (e) => {
            if(e.target.files[0]) {
                setImage(e.target.files[0]);
            }
        };
        function handleSubmit() {
            upload(image, currentUser, setLoading );
        }
        useEffect(() => {
            if(currentUser?.photoURL){
                setphotoURL(currentUser.photoURL);
        }
        }, [currentUser])

    /*const handleSubmit = () => {
        const imageRef = ref(storage, "image");
        uploadBytes(imageRef, image)
        .then(() => {
            getDownloadURL(imageRef).then((url) => {
                setUrl(url);
            })
            .catch((error) => {
                console.log(error.message, "error getting image url");
            });
            setImage(null);
        })
        .catch((error) => {
            console.log(error.message);
    });
};
    */
    
    // Handles dropdown menu from profile picture
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);
    const handleClick = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl2(null);
    };

    function handleTheme()
    {
        var theme = JSON.parse(localStorage.getItem(`theme`));
        localStorage.setItem(`theme`, JSON.stringify(!theme));
        window.location.reload();
    }
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
                        position: "fixed",
                    }}>
                        <div className="container-fluid">
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
                            <Button onClick={() => (window.location.href = "/AuthDetails")} sx={{ mt: 5, mb: 2, borderRadius: 3, border: "1px solid"}} color="white" variant="outlined"><LogoutOutlinedIcon sx={{width: 20, height: 20, mr: 1}}/>Log Out</Button>
                        </Box>
                    </Box>
                </Grid>
                    <AppBar elevation={12} color="white" sx={{width: `calc(100% - ${200}px)`}}>   
                        <Toolbar>
                            <Typography sx={{fontWeight: "bold"}}variant="h4">Profile</Typography>
                            <Box sx={{flexGrow: 1}}></Box>
                            <Button sx={{textTransform: "none"}} onClick={handleClick}><Avatar src= {photoURL} sx={{bgcolor: "#6284FF26"}}><PermIdentityRoundedIcon sx={{color: "#6284FF"}} /></Avatar><Typography sx={{fontWeight: "bold", color: theme ? "#fff" : "black", ml: 1}}>{data?.firstName} {data?.lastName}</Typography></Button>
                            <Menu
                                id="profile-menu"
                                anchorEl={anchorEl2}
                                open={open2}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => (window.location.href = "/Profile")}>Profile</MenuItem>
                                <MenuItem onClick={() => (window.location.href = "/")}>Tasks</MenuItem>
                                <MenuItem onClick={() => (window.location.href = "/AuthDetails")}>Log Out</MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>
                {/* Page information*/}
                
                <Grid item xs={10}>
                    <Box sx={{mt: 12, width: "100%"}}>
                        <FormControl sx={{width: "100%"}}>

                            { /* User Info */ }
                            <Box
                                sx={{width: "100%"}}
                                display="flex"
                            >
                                <Typography variant="h5" sx={{mb: 2, fontWeight: "bold"}}>User Info</Typography>
                                <Box sx={{flexGrow:1}} />
                                <MaterialUISwitch defaultChecked={JSON.parse(localStorage.getItem(`theme`))} onChange={handleTheme} />
                            </Box>
                            <Paper sx={{width: "100%", height: "15vh", borderRadius: 3}} elevation={12}>
                                <Box
                                    sx={{display: "flex", flexDirection: "row", ml: 4, mt: "2vh"}}
                                >
                                    <Typography sx={{flexGrow: 1}}><PermIdentityRoundedIcon color="purple" />First Name</Typography>
                                    <Typography sx={{flexGrow: .9}}><PermIdentityRoundedIcon color="purple" />Last Name</Typography>
                                    <Typography sx={{flexGrow: .4}}><PermIdentityRoundedIcon color="purple" />Profile Picture</Typography>
                                </Box>
                                <Box
                                    sx={{display: "flex", flexDirection: "row"}}
                                >
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3, ml: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder={data?.firstName} 
                                        defaultValue={data?.firstName} 
                                        id='FirstName'> 
                                    </TextField>
                                    
                                    <TextField  
                                        sx={{flexGrow: 1, mr: 3}}
                                        InputProps={{ sx: {borderRadius: 3}}}
                                        placeholder={data?.lastName}
                                        defaultValue={data?.lastName} 
                                        id='LastName'> 
                                    </TextField>
                                    <Box>
                                    <input type="file"  onChange={handleImageChange} />
                                    <Button disabled = {loading || !image} color="purple" sx={{width: "18%", height: "3vh", borderRadius: 3, boxShadow: 12}} variant="contained"  onClick={handleSubmit}>Submit</Button>
                                    </Box>
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
                                        id='Pomodoro'> 
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