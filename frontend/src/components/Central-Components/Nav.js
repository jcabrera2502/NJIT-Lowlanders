import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { onAuthStateChanged } from "firebase/auth";
import { auth} from "../../firebase";

//Only show Profile if the user is logged in
//Only show Settings if the user is logged in
//Only show Logout if the user is logged in


function Nav() {
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

    return(
        
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark top">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMainMenu" aria-controls="navMainMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navMainMenu" class="navbar-collapse collapse">
                <div class="navbar-nav ml-auto">
                    {user && <Link to='/' className="nav-item nav-link active">Home</Link>}
                    {!user && <Link to='/SignIn' className="nav-item nav-link">SignIn</Link>}
                    {!user && <Link to ='/SignUp' className="nav-item nav-link">SignUp</Link>}
                    {user && <Link to ='/AuthDetails' className="nav-item nav-link">Logout</Link>}
                    {user && <Link to ='/Profile' className="nav-item nav-link"><FaUserCircle /></Link>}
                    {user && <Link to ='/Settings' className="nav-item nav-link"><FaGear /></Link>}
                </div>
            </div>
        </nav>
    );
}

export default Nav;