//CURRENTLY DOES ABOSOLUTELY NOTHING

import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Box, Button, Select, MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import { isThisCurrent, getCurrentMonth, getCurrentDay, getCurrentYear } from "./date_functions";
//import { forwardGetUserTasks } from "./Home";

export /*const*/ function DateNav/* = forwardRef((ref) => */(){
    const [month, setMonth] = React.useState(getCurrentMonth);
    const [day, setDay] = React.useState(getCurrentDay);
    const [year, setYear] = React.useState(getCurrentYear);

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
        dateRules(event.target.value, year);
        //forwardGetUserTasks();
    }
    const handleDayChange = (event) => {
        setDay(event.target.value);
        //forwardGetUserTasks();
    }
    const handleYearChange = (event) => {
        setYear(event.target.value);
        dateRules(month, event.target.value);
        //forwardGetUserTasks();
    }

    function leap(y) {
        if (y % 4 === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    function dateRules(m, y) {
        //console.log(m + "/" + day + "/" + y);
        if (day > 29 && leap(y) && m === 2) {
            //console.log("one");
            setDay(29);
        }
        else if (day > 28 && m === 2 && !leap(y)) {
            //console.log("two");
            setDay(28);
        }
        else if (day > 30 && thirty.includes(m)) {
            //console.log("three");
            setDay(30);
        }
    }
    function getMaxDay(m, y) {
        if (thirtyOne.includes(m)) {
            return 31;
        }
        else if (thirty.includes(m)) {
            return 30;
        }
        else if (m === 2 && leap(y)) {
            return 29;
        }
        else {
            return 28;
        }
    }

    const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
    const thirty = [4, 6, 9, 11];
    /*
    const publicRef = {
        getMonth: () => {
            return month;
        },
        getDay: () => {
            return day;
        },
        getYear: () => {
            return year;
        },
        isItCurrent: () => {
            return isThisCurrent(month, day, year);
        },
    };
    useImperativeHandle(ref, () => publicRef);
    */
    function getMonth() {
        return month;
    }
    function getDay() {
        return day;
    }
    function getYear() {
        return year;
    }
    
    function isItCurrent() {
        return isThisCurrent(month, day, year);
    }

    return (
        <Box
            sx={{ mt: 12, width: "100%", bgcolor: "#E8EDFF", borderRadius: 3, }}
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Button variant="outlined" onClick={() => {
                if (month === 1) {
                    setMonth(12);
                    setYear(year - 1);
                }
                else {
                    setMonth(month - 1);
                }
                dateRules(month, year);
            }}
                sx={{ minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1 }}
                //color="menu"
                >
                <ExpandCircleDownRoundedIcon sx={{ transform: "rotate(90deg)", height: 28, width: 28 }} />
            </Button>
            <FormControl sx={{ mr: .5, ml: .5, mt: 1, mb: 1, minWidth: 160 }}>
                <Select
                    value={month}
                    onChange={handleMonthChange}
                    IconComponent={ExpandCircleDownOutlinedIcon}
                    sx={{
                        fontSize: "large",
                        fontWeight: "bold",
                        height: "50px",
                        padding: 0,
                        borderRadius: 3,
                        '& .MuiOutlinedInput-notchedOutline': { border: 1, borderColor: "#6284FF", },
                        '.MuiSvgIcon-root': { fill: "#6284FF" }
                    }}
                >
                    <MenuItem value={1}>January</MenuItem>
                    <MenuItem value={2}>February</MenuItem>
                    <MenuItem value={3}>March</MenuItem>
                    <MenuItem value={4}>April</MenuItem>
                    <MenuItem value={5}>May</MenuItem>
                    <MenuItem value={6}>June</MenuItem>
                    <MenuItem value={7}>July</MenuItem>
                    <MenuItem value={8}>August</MenuItem>
                    <MenuItem value={9}>September</MenuItem>
                    <MenuItem value={10}>October</MenuItem>
                    <MenuItem value={11}>November</MenuItem>
                    <MenuItem value={12}>December</MenuItem>
                </Select>
            </FormControl>
            <Button variant="outlined" onClick={() => {
                if (month === 12) {
                    setMonth(1);
                    setYear(year + 1);
                    dateRules(1, year + 1);
                }
                else {
                    setMonth(month + 1);
                    dateRules(month + 1, year);
                }
            }}
                sx={{ minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, mr: 3, border: 1 }}
                //color="menu"
                >
                <ExpandCircleDownRoundedIcon sx={{ transform: "rotate(270deg)", height: 28, width: 28 }} />
            </Button>
            <Button variant="outlined" onClick={() => {
                if (day === 1) {
                    if (month === 1) {
                        setMonth(12);
                        setDay(31);
                        setYear(year - 1);
                    }
                    else {
                        //console.log(month);
                        setMonth(month - 1);
                        //console.log(month);
                        setDay(getMaxDay(month - 1, year));
                    }
                }
                else {
                    setDay(day - 1);
                }
                //dateRules(month, year);
            }}
                sx={{ minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1 }}
                //color="menu"
                >
                <ExpandCircleDownRoundedIcon sx={{ transform: "rotate(90deg)", height: 28, width: 28 }} />
            </Button>
            <FormControl sx={{ mr: .5, ml: .5, mt: 1, mb: 1, minWidth: 90 }}>
                <Select
                    value={day}
                    onChange={handleDayChange}
                    IconComponent={ExpandCircleDownOutlinedIcon}
                    sx={{
                        fontSize: "large",
                        fontWeight: "bold",
                        height: "50px",
                        padding: 0,
                        borderRadius: 3,
                        '& .MuiOutlinedInput-notchedOutline': { border: 1, borderColor: "#6284FF", },
                        '.MuiSvgIcon-root': { fill: "#6284FF" }
                    }}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={11}>11</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={13}>13</MenuItem>
                    <MenuItem value={14}>14</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={17}>17</MenuItem>
                    <MenuItem value={18}>18</MenuItem>
                    <MenuItem value={19}>19</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={21}>21</MenuItem>
                    <MenuItem value={22}>22</MenuItem>
                    <MenuItem value={23}>23</MenuItem>
                    <MenuItem value={24}>24</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={26}>26</MenuItem>
                    <MenuItem value={27}>27</MenuItem>
                    <MenuItem value={28}>28</MenuItem>
                    {thirty.includes(month) || thirtyOne.includes(month) || (month === 2 && leap(year))
                        ? <MenuItem value={29}>29</MenuItem>
                        : null
                    }
                    {thirty.includes(month) || thirtyOne.includes(month)
                        ? <MenuItem value={30}>30</MenuItem>
                        : null
                    }
                    {thirtyOne.includes(month)
                        ? <MenuItem value={31}>31</MenuItem>
                        : null
                    }
                </Select>
            </FormControl>
            <Button variant="outlined" onClick={() => {
                if (day === getMaxDay(month, year)) {
                    if (month === 12) {
                        setMonth(1);
                        setDay(1);
                        setYear(year + 1);
                    }
                    else {
                        //console.log(month);
                        setMonth(month + 1);
                        //console.log(month);
                        setDay(1);
                    }
                }
                else {
                    setDay(day + 1);
                }
                //dateRules(month, year);
            }}
                sx={{ minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, mr: 3, border: 1 }}
                //color="menu"
                >
                <ExpandCircleDownRoundedIcon sx={{ transform: "rotate(270deg)", height: 28, width: 28 }} />
            </Button>
            <Button variant="outlined" onClick={() => {
                setYear(year - 1);
                dateRules(month, year - 1);
            }}
                sx={{ minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1 }}
                //color="menu"
                >
                <ExpandCircleDownRoundedIcon sx={{ transform: "rotate(90deg)", height: 28, width: 28 }} />
            </Button>
            <FormControl sx={{ mr: .5, ml: .5, mt: 1, mb: 1, minWidth: 100 }}>
                <Select
                    value={year}
                    onChange={handleYearChange}
                    IconComponent={ExpandCircleDownOutlinedIcon}
                    sx={{
                        fontSize: "large",
                        fontWeight: "bold",
                        height: "50px",
                        padding: 0,
                        borderRadius: 3,
                        '& .MuiOutlinedInput-notchedOutline': { border: 1, borderColor: "#6284FF", },
                        '.MuiSvgIcon-root': { fill: "#6284FF" }
                    }}
                >
                    <MenuItem value={2022}>2022</MenuItem>
                    <MenuItem value={2023}>2023</MenuItem>
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2026}>2026</MenuItem>
                    <MenuItem value={2027}>2027</MenuItem>
                    <MenuItem value={2028}>2028</MenuItem>
                    <MenuItem value={2029}>2029</MenuItem>
                </Select>
            </FormControl>
            <Button variant="outlined" onClick={() => {
                setYear(year + 1);
                dateRules(month, year + 1);
            }}
                sx={{ minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1 }}
                //color="menu"
                >
                <ExpandCircleDownRoundedIcon sx={{ transform: "rotate(270deg)", height: 28, width: 28 }} />
            </Button>
        </Box>
    )
}
//);