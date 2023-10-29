import React from "react";




function Settings() {
    return (
        <div>
        <h1><u>Settings</u></h1>
            <div>
                <h2>Account</h2>
                <button type="button"> Change Username</button>
                <button type="button"> Change Password</button>
                <button type="button"> Change Email</button>
                <button type="button"> Change Phone Number</button>
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
                <h2>Date Format: </h2>
                <select> 
                    <option value="MonthDayYear">MM/DD/YYYY</option>
                    <option value="DayMonthYear">DD/MM/YYYY</option>
                </select>
            </div>
            <div>
                <h2>Time: </h2>
                <select>
                    <option value="EST">Eastern Standard Time</option>
                    <option value="CST">Central Standard Time</option>
                    <option value="PST">Pacific Standard Time</option>
                </select>
                <select>
                    <option value="Twelve">12-hour</option>
                    <option value="TwentyFour">24-hour</option>
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
                <button type="button"> Delete Account</button>
            </div>
        </div>
    );
}

export default Settings;