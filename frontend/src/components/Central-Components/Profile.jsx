import { onAuthStateChanged} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";

const Profile = () => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
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
            time = (date.getHours() - 12) + ":" + date.getMinutes() + " pm"; 
        }
        else if (date.getHours() == 12) {
            time = date.getHours() + ":" + date.getMinutes() + " pm";
        }
        else if (date.getHours() == 0) {
            time = "12:" + date.getMinutes() + " am";
        }
        else {
            time = date.getHours() + ":" + date.getMinutes() + " am";
        }
    } else /*TwentyFour*/ {
        time = date.getHours() + ":" + date.getMinutes();
    }

    
    return (
        <div>
        <h1>Profile</h1>
        <p>Email: {user?.email}</p>
        <p> Name: {user?.displayName}</p>
        <p> Phone: {user?.phoneNumber}</p>
        <p> Photo: {user?.photoURL}</p>
        <p> Date: {dateFormatted}</p>
        <p> Time: {time}</p>
        </div>
    );
    }

export default Profile;