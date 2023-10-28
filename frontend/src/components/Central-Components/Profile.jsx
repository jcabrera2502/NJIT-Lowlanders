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
    
    
    return (
        <div>
        <h1>Profile</h1>
        <p>Email: {user?.email}</p>
        <p> Name: {user?.displayName}</p>
        <p> Phone: {user?.phoneNumber}</p>
        <p> Photo: {user?.photoURL}</p>
        </div>
    );
    }

export default Profile;