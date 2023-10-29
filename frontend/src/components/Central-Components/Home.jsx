import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import Dhruv from "../../Images/Dhruvy.jfif";
import { Button, Typography, Container, CssBaseline, Box} from "@mui/material";

function Home() 
{
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

    return (
        <CssBaseline>
            <Box sx={{margin: "110px auto"}}>
                {user ? (
                    <div>
                        <Typography textAlign={"center"} variant="h3">Welcome {user.email}</Typography>
                        <Box textAlign={"center"} sx={{padding: "10px"}}>
                            <img src={Dhruv} alt="Dhruv" />
                        </Box>
                    </div>
                ) : (
                    <h1>You need to login</h1>
                )}
            </Box>
        </CssBaseline>
    );
    }

export default Home;