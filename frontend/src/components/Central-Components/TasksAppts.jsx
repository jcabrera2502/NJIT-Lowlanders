import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Typography, CssBaseline, Box, MenuItem, Divider, Button, Container, Grid} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getCurrentMonth, getCurrentDay, getCurrentYear, 
    printDate, printThisDate, printTime, printThis12Time, 
    printThis24Time, isThisCurrent } from "./date_functions";
import WebIcon from "../../Images/Logo.svg";
import { display, positions, sizing  } from '@mui/system';



const TasksAppts = () => {
    const [month, setMonth] = React.useState(getCurrentMonth);
    const handleMonthChange = (event) => {
        //console.log("choice " + event.target.value);
        //console.log("before " + month);
        setMonth(event.target.value);
        //console.log("after " + month);
        dateRules(event.target.value, year);
    }
    const [day, setDay] = React.useState(getCurrentDay);
    const handleDayChange = (event) => {
        setDay(event.target.value);
    }
    const [year, setYear] = React.useState(getCurrentYear);
    const handleYearChange = (event) => {
        setYear(event.target.value);
        dateRules(month, event.target.value);
    }
    function leap(y) {
        if (y % 4 == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    function dateRules(m, y) {
        //console.log(m + "/" + day + "/" + y);
        if (day > 29 && leap(y) && m == 2) {
            //console.log("one");
            setDay(1);
        }
        else if (day > 28 && m == 2 && !leap(y)) {
            //console.log("two");
            setDay(1);
        }
        else if (day > 30 && thirty.includes(m)) {
            console.log("three");
            setDay(1);
        }
    }

    const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
    const thirty = [4, 6, 9, 11];

    

    return(
        <CssBaseline>
            <Box sx={{ marginTop: 7, flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Box positions="left" textAlign={"center"} sx={{
                            color: '#FFFFFF',
                            background: '#252628',
                            height: 1,
                            width: '200px',
                            padding: "10px",
                            
                        }}>
                            <div class="container-fluid">
                                <h1 class="mt-5">Crush It</h1>
                                <Divider variant="middle" color="#3E3F42" sx={{ height: 2, width: '160px' }} />
                                <Box textAlign={"center"} sx={{padding: "10px"}} >
                                    <img src={WebIcon} width={148} height={148} alt="WebIcon" />
                                </Box>

                                <Box textAlign={"center"}>
                                    <Typography textAlign={"center"} variant={"h5"}>{`It’s time to plan your day!`}</Typography>
                                        <Button sx={{ mt: 3, mb: 2}} variant="contained">Plan Day</Button>
                                </Box>
                                
                            </div>
                        </Box>
                    </Grid>
                        

                    <Grid item padding="10px"  xs={8}>
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
                    </Grid>
                    
                </Grid>
            </Box>
        </CssBaseline>
    );
}

export default TasksAppts;