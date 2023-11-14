import React from "react";
import {
    Button, Typography, Stack, CssBaseline, Box, Grid,
    Select, MenuItem, FormControl, Slider
} from "@mui/material";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import "./style.css";


function TasksAppt() {
    const PlanDaySideBar = () => {
        const Title = () => {
            return (
                <div className="label">
                    <div className="text-wrapper">Crush It</div>
                </div>
            );
        };
        const Logo = () => {
            return (
                <div className="box">
                    <img className="group" alt="Group" src="group-2.png" />
                </div>
            );
        };
        const Slogan = () => {
            return (
                <div className="label">
                    <p className="text-wrapper">It’s time to plan your day!</p>
                </div>
            );
        };





    };
};


export default TasksAppt;