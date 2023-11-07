import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import WebIcon from "../../Images/WebIcon.jfif";
import { Typography, CssBaseline, Box} from "@mui/material";
import Nav from './Nav';

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
            <Nav />
            <Box sx={{margin: "110px auto"}}>
                {user ? (
                    
                    <div>
                        <Typography textAlign={"center"} variant="h3">Welcome {user.email}</Typography>
                        <Box textAlign={"center"} sx={{padding: "10px"}} >
                            <img src={WebIcon} width={542} height={542} alt="WebIcon" />
                        </Box>
                    </div>
                ) : (
                    <Typography textAlign={"center"}variant="h3">You need to login</Typography>
                )}
            </Box>
        </CssBaseline>
    );
    }

export default Home;