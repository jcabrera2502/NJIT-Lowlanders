import React from "react";
import { auth } from "../../firebase";




function Settings() {
    return (
        <div>
        <h1><u>Settings</u></h1>
            <div>
                <h2>Account</h2>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/ChangeUsername")}> Change Username</button>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/ChangePassword")}> Change Password</button>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/ChangeEmail")}> Change Email</button>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/ChangePhoneNumber")}> Change Phone Number</button>
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
            <div>
                <h2>Adjust Volume: </h2>
                <select> 
                    <option value="100">100</option>
                    <option value="95">95</option>
                    <option value="90">90</option>
                    <option value="85">85</option>
                    <option value="80">80</option>
                    <option value="75">75</option>
                    <option value="70">70</option>
                    <option value="65">65</option>
                    <option value="60">60</option>
                    <option value="55">55</option>
                    <option value="50">50</option>
                    <option value="45">45</option>
                    <option value="40">40</option>
                    <option value="35">35</option>
                    <option value="30">30</option>
                    <option value="25">25</option>
                    <option value="20">20</option>
                    <option value="15">15</option>
                    <option value="10">10</option>
                    <option value="5">5</option>
                    <option value="0">0</option>
                </select>
            </div>
            <div>
                <h2>Theme: </h2>
                <button> Dark Theme </button>
            </div>
            <div>
                <h2>Delete Account</h2>
                <button type="button" onClick={() => (window.location.href = "http://localhost:3000/DeleteAccount")}> Delete Account</button>
            </div>
        </div>
    );
}

export default Settings;