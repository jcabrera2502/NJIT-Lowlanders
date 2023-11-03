import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Typography, CssBaseline, Box, MenuItem} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getCurrentMonth, getCurrentDay, getCurrentYear, 
    printDate, printThisDate, printTime, printThis12Time, 
    printThis24Time, isThisCurrent } from "./date_functions";

const TasksAppts = () => {
    const [month, setMonth] = React.useState(getCurrentMonth);
    const handleMonthChange = (event) => {
        setMonth(event.target.value);
        dateRules();
    }
    const [day, setDay] = React.useState(getCurrentDay);
    const handleDayChange = (event) => {
        setDay(event.target.value);
    }
    const [year, setYear] = React.useState(getCurrentYear);
    const handleYearChange = (event) => {
        setYear(event.target.value);
        dateRules();
    }
    function leap(y) {
        if (y % 4 == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    function dateRules() {
        if (day > 29 && leap(year) && month == 2) {
            setDay(1);
        }
        else if (day > 28 && month == 2) {
            setDay(1);
        }
        else if (day > 30 && thirty.includes(month)) {
            setDay(1);
        }
    }

    const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
    const thirty = [4, 6, 9, 11];

    return(
        <section>
            <div class="container-fluid">
                <h1 class="mt-5">Welcome</h1>
                <p>This site is was created using node js and React</p>
            </div>
            <FormControl sx={{ m: 1, minWidth: 120}}>
                <Select
                    value={month}
                    onChange={handleMonthChange}
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
            <FormControl sx={{ m: 1, minWidth: 120}}>
                <Select
                    value={day}
                    onChange={handleDayChange}
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
                    {thirty.includes(month) || thirtyOne.includes(month) || (month == 2 && leap(year))
                        ? <MenuItem value={29}>29</MenuItem>
                        : <></> 
                    }
                    {thirty.includes(month) || thirtyOne.includes(month)
                        ? <MenuItem value={30}>30</MenuItem>
                        : <></>
                    }
                    {thirtyOne.includes(month)
                        ? <MenuItem value={31}>31</MenuItem>
                        : <></>
                    }
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120}}>
                <Select
                    value={year}
                    onChange={handleYearChange}
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
            <p>
                Selected {month}/{day}/{year}
                {isThisCurrent(month, day, year) ? <p>This is today</p> : <p>Today not selected</p>}
            </p>
        </section>
    );
}
export default TasksAppts;