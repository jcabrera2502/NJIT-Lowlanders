import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import Dhruv from "../../Images/Dhruvy.jfif";

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
        <div>
        <h1>Home</h1>
        {user ? (
            <div>
            <h1>Welcome {user.email}</h1>
            <img src={Dhruv} alt="Dhruv" />
            </div>
        ) : (
            <h1>You need to login</h1>
        )}
        </div>
    );
    }

export default Home;