import React from "react";
import { auth } from "../../firebase";


function Settings() {
    return (
        <div>
        <h1><u>Settings</u></h1>
            <div>
                <h2>Account</h2>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/ChangePassword")}> Change Password</button>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/ChangeEmail")}> Change Email</button>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/DeleteAccount")}> Delete Account</button>
            </div>
            <div>
                <h2>Notifications</h2>
                <button type="button"> Turn on notifications</button>
            </div>
            <div>
                <h2>Language: </h2>
                <select> 
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                </select>
            </div>
        </div>
    );
}

export default Settings;