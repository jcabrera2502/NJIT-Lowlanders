import { onAuthStateChanged } from "firebase/auth";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {List, ListItem} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Typography, CssBaseline, Box, MenuItem, Divider, Button, AppBar, Grid, Toolbar, Avatar, Paper, IconButton} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getCurrentMonth, getCurrentDay, getCurrentYear, 
    printDate, printThisDate, printTime, printThis12Time, 
    printThis24Time, isThisCurrent } from "./date_functions";
import WebIcon from "../../Images/Logo.svg";
import { display, positions, sizing  } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenWithRoundedIcon from '@mui/icons-material/OpenWithRounded';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { initializeAnalytics } from "firebase/analytics";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';

const TasksAppts = () => {
    const [user, setUser] = useState(null);
    const [userPresentInDatabase, setUserPresentInDatabase] = useState(false);
    const [data, setData] = useState(null);
    const [month, setMonth] = React.useState(getCurrentMonth);
    const [day, setDay] = React.useState(getCurrentDay);
    const [year, setYear] = React.useState(getCurrentYear);
    const [selectedDate, setSelectedDate] = React.useState(new Date(year, month - 1, day));
// Update isThisCurrent function
function isThisCurrent(date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    date.setHours(0, 0, 0, 0); // Set selected date to midnight
    console.log("Current Date:", currentDate);
    console.log("Selected Date:", date);
    return date.getTime() === currentDate.getTime();
  }
    const fetchUserData = async (user) => {
        if (!userPresentInDatabase) {
            const response = await axios.get("/api/email", {
                params: {
                    email: user.email,
                }
            });

            if (response) {
                setUserPresentInDatabase(true);
                console.log("User already in database");
                console.log(response.data);
                setData(response.data);
            }
        }
    };
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);
    useEffect(() => {
        if (user) {
            fetchUserData(user);

        }
    }, [user]);

    useEffect(() => {
        console.log("Selected Date:", selectedDate);
      }, [selectedDate]);
    const updateSelectedDate = (newMonth, newDay, newYear) => {
        setSelectedDate(new Date(newYear, newMonth - 1, newDay));
      };
      const handleMonthChange = (event) => {
        console.log("Selected Date Before:", selectedDate);
        setMonth(event.target.value);
        dateRules(event.target.value, year);
        console.log("Selected Date After:", selectedDate);
    };useEffect(() => {
        updateSelectedDate(month, day, year);
    }, [month, day, year]);
    
    const handleDayChange = (event) => {
        setDay(event.target.value);
        updateSelectedDate(month, event.target.value, year);

    }
    const handleYearChange = (event) => {
        setYear(event.target.value);
        dateRules(month, event.target.value);
        updateSelectedDate(month, day, event.target.value);

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
    function getMaxDay(m, y) {
        if (thirtyOne.includes(m)) {
            return 31;
        }
        else if (thirty.includes(m)) {
            return 30;
        }
        else if (m == 2 && leap(y)) {
            return 29;
        }
        else {
            return 28;
        }
    }

    const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
    const thirty = [4, 6, 9, 11];

    return(
        <CssBaseline>
        <Grid container>
            <Grid item xs={1.64}>
            <Box positions="left" textAlign={"center"} sx={{
                color: '#FFFFFF',
                background: '#252628',
                height: "100vh",
                width: '200px',
                padding: "10px",
            }}>
                <div class="container-fluid">
                    <Typography sx ={{mt: 3, mb: 4}} variant="h4">Crush It</Typography>
                    <Divider variant="middle" color="#3E3F42" sx={{ height: 2, width: '160px' }} />
                    <Box textAlign={"center"} sx={{padding: "10px"}} >
                        <img src={WebIcon} width={148} height={148} alt="WebIcon" />
                    </Box>

                    <Box textAlign={"center"}>
                        <Typography textAlign={"center"} variant={"h5"}>{`It’s time to plan your day!`}</Typography>
                        {isThisCurrent(selectedDate) && (
                            <Button sx={{ mt: 5, mb: 2, borderRadius: 3, width: 150, height: 50, border: "2px solid" }} color="white" variant="outlined">
                            Plan Day
                            </Button>
                        )}        
                    </Box>
                </div>
                
                <Box sx={{mt: "32vh"}}>
                    <Button onClick={() => (window.location.href = "http://localhost:3000/AuthDetails")} sx={{ mt: 5, mb: 2, borderRadius: 3, border: "1px solid"}} color="white" variant="outlined"><LogoutOutlinedIcon sx={{width: 20, height: 20, mr: 1}}/>Log Out</Button>
                </Box>
            </Box>
        </Grid>
            <AppBar elevation={12} color="white" sx={{width: `calc(100% - ${200}px)`}}>   
                <Toolbar>
                    <Typography sx={{fontWeight: "bold"}}variant="h4">Tasks</Typography>
                    <Box sx={{flexGrow: 1}}></Box>
                    <Button sx={{textTransform: "none"}} onClick={() => (window.location.href = "http://localhost:3000/Profile")}><Avatar sx={{bgcolor: "#E8EDFF"}}><PermIdentityRoundedIcon sx={{color: "#6284FF"}} /></Avatar><Typography sx={{fontWeight: "bold", color: "black", ml: 1}}>{data?.firstName} {data?.lastName}</Typography></Button>
                </Toolbar>
            </AppBar>
                        
                    <Grid item xs={10}>
                        <Box 
                            sx={{mt: 12, width: "100%", bgcolor: "#E8EDFF"}}
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
                            sx={{minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1}}
                            color="menu">
                                <ExpandCircleDownRoundedIcon sx={{transform: "rotate(90deg)", height: 28, width: 28}}/>
                            </Button>
                            <FormControl sx={{ mr: .5, ml: .5, mt: 1, mb: 1, minWidth: 160}}>
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
                                        '& .MuiOutlinedInput-notchedOutline': {border: 1, borderColor: "#6284FF",},
                                         '.MuiSvgIcon-root': {fill: "#6284FF"}}}
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
                            sx={{minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, mr: 3, border: 1}}
                            color="menu">
                                <ExpandCircleDownRoundedIcon sx={{transform: "rotate(270deg)", height: 28, width: 28}}/>
                            </Button>
                            <Button variant="outlined" onClick={() => {
                                if (day === 1) {
                                    if (month == 1) {
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
                            sx={{minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1}}
                            color="menu">
                                <ExpandCircleDownRoundedIcon sx={{transform: "rotate(90deg)", height: 28, width: 28}}/>
                            </Button>
                            <FormControl sx={{ mr: .5, ml: .5, mt: 1, mb: 1, minWidth: 90}}>
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
                                        '& .MuiOutlinedInput-notchedOutline': {border: 1, borderColor: "#6284FF",}, 
                                        '.MuiSvgIcon-root': {fill: "#6284FF"}}}
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
                            <Button variant="outlined" onClick={() => {
                                if (day == getMaxDay(month, year)) {
                                    if (month == 12) {
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
                            sx={{minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, mr: 3, border: 1}}
                            color="menu">
                                <ExpandCircleDownRoundedIcon sx={{transform: "rotate(270deg)", height: 28, width: 28}}/>
                            </Button>
                            <Button variant="outlined" onClick={() => {
                                setYear(year - 1);
                                dateRules(month, year - 1);
                            }}
                            sx={{minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1}}
                            color="menu">
                                <ExpandCircleDownRoundedIcon sx={{transform: "rotate(90deg)", height: 28, width: 28}}/>
                            </Button>
                            <FormControl sx={{ mr: .5, ml: .5, mt: 1, mb: 1, minWidth: 100}}>
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
                                        '& .MuiOutlinedInput-notchedOutline': {border: 1, borderColor: "#6284FF",}, 
                                        '.MuiSvgIcon-root': {fill: "#6284FF"}}}
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
                            sx={{minWidth: "50px", height: "50px", padding: 0, borderRadius: 3, border: 1}}
                            color="menu">
                                <ExpandCircleDownRoundedIcon sx={{transform: "rotate(270deg)", height: 28, width: 28}}/>
                            </Button>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <Box>
                                <Typography variant="h5" sx={{fontWeight: "bold",mt:2, fontSize:'30px'}}>
                                    Tasks
                                    <IconButton sx={{}} aria-label="addTask">
                                        <Avatar sx={{bgcolor: "#5D8EFF"}}><AddIcon sx={{color: "#FFF"}} /></Avatar>
                                    </IconButton>
                                </Typography>                                                    
                                <Paper sx={{width: "100%", height: "90%", borderRadius: "10px", p:2, flexWrap: 'wrap'}} elevation={12}>
                                    <Box sx={{display: "flex", flexDirection: "column", }}>
                                        <Box sx={{ 
                                            ml:2,
                                            width: "95%", 
                                            height: "100%",  
                                            bgcolor: "#F5F7F9",
                                            borderRadius: "8px",}}>
                                            <Typography sx={{ml:2,mt:2, fontWeight: 700, fontSize:'20px'}}>
                                                Top Priority
                                            </Typography>
                                            <Box sx={{ 
                                                ml:2,
                                                mt:1,
                                                width: "95%", 
                                                height: "70%",  
                                                bgcolor: "#FFF",
                                                borderRadius: "8px",}}>
                                                
                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <IconButton sx={{}} aria-label="checked">
                                                        <CheckCircleOutlineIcon sx={{ color:"black"}} />
                                                        </IconButton>

                                                        <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF"}}>
                                                            Complete Math Homework
                                                        </Typography> 
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton aria-label="drag">
                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                        </IconButton>

                                                        <IconButton sx={{}} aria-label="expandTask">
                                                            <ExpandCircleDownOutlinedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>                                                                                                


                                                <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />


                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color:"#1F1F1F"}}>
                                                            Number of Pomodoro Timers (30 mins each)
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography display={"inline"} sx={{ fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                            2
                                                        </Typography>
                                                        <IconButton sx={{ml: 2}} aria-label="editNumOfTimers">
                                                            <BorderColorOutlinedIcon sx={{color:"#6284FF"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid> 

                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color:"#545454"}}>
                                                            Notes
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton sx={{ml: 2}} aria-label="editNote">
                                                            <BorderColorOutlinedIcon sx={{color:"#6284FF"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                                <Box sx={{ml:2, mt:1, width: "85%"}}>
                                                    <Typography display={"inline"} sx={{fontWeight: 700, fontSize:'14px', color:"#1F1F1F"}}>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                    </Typography>    
                                                </Box>
                                            </Box>
                                            <Box sx={{ 
                                                ml:2,
                                                mt:1,
                                                mb:1,
                                                width: "95%", 
                                                height: "70%",  
                                                bgcolor: "#FFF",
                                                borderRadius: "8px",}}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <IconButton sx={{}} aria-label="hourGlass">
                                                            <HourglassEmptyRoundedIcon sx={{ color:"black"}} />
                                                        </IconButton>

                                                        <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF"}}>
                                                            Assign Leader For Task 1
                                                        </Typography> 
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton aria-label="drag">
                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                        </IconButton>

                                                        <IconButton sx={{}} aria-label="expandTask">
                                                            <ExpandCircleDownOutlinedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>  
                                            </Box>
                                        </Box>
                                        <Box sx={{ 
                                            mt:1,
                                            ml:2,
                                            width: "95%", 
                                            height: "100%",  
                                            bgcolor: "#F5F7F9",
                                            borderRadius: "8px",}}>
                                            <Typography sx={{ml:2,mt:2, fontWeight: 700, fontSize:'20px'}}>
                                                Important
                                            </Typography>
                                            <Box sx={{ 
                                                ml:2,
                                                mt:1,
                                                mb:1,
                                                width: "95%", 
                                                height: "70%",  
                                                bgcolor: "#FFF",
                                                borderRadius: "8px",}}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <IconButton sx={{}} aria-label="checked">
                                                            <CheckCircleOutlineIcon sx={{ color:"black"}} />
                                                        </IconButton>

                                                        <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF"}}>
                                                            Complete Math Homework
                                                        </Typography> 
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton aria-label="drag">
                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                        </IconButton>

                                                        <IconButton sx={{}} aria-label="expandTask">
                                                            <ExpandCircleDownOutlinedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>

                                                <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />

                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color:"#1F1F1F"}}>
                                                            Number of Pomodoro Timers (30 mins each)
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography display={"inline"} sx={{fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                            <IconButton sx={{}} aria-label="plusTimer">
                                                                <AddBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                            </IconButton>
                                                            2
                                                            <IconButton sx={{}} aria-label="minusTimer">
                                                                <IndeterminateCheckBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                            </IconButton>
                                                        </Typography>
                                                        <IconButton sx={{}} aria-label="editingTimers">
                                                            <CheckBoxRoundedIcon sx={{color:"#6284FF"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid> 
                                            </Box>
                                            <Box sx={{ 
                                                ml:2,
                                                mt:1,
                                                mb:1,
                                                width: "95%", 
                                                height: "70%",  
                                                bgcolor: "#FFF",
                                                borderRadius: "8px",}}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <IconButton sx={{}} aria-label="switchLeader">
                                                            <SyncAltIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                        <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF"}}>
                                                        Assign Leader For Task 1
                                                        </Typography> 
                                                    </Grid>

                                                    <Grid item>
                                                        <IconButton aria-label="drag">
                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                        <IconButton sx={{}} aria-label="expandTask">
                                                            <ExpandCircleDownOutlinedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Box>
                                        <Box sx={{ 
                                            mt:1,
                                            ml:2,
                                            width: "95%", 
                                            height: "100%",  
                                            bgcolor: "#F5F7F9",
                                            borderRadius: "8px",}}>
                                            <Typography sx={{ml:2,mt:2, fontWeight: 700, fontSize:'20px'}}>
                                                Other
                                            </Typography>
                                            <Box sx={{ 
                                                ml:2,
                                                mt:1,
                                                mb:1,
                                                width: "95%", 
                                                height: "70%",  
                                                bgcolor: "#FFF",
                                                borderRadius: "8px",}}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <IconButton sx={{}} aria-label="hourGlass">
                                                            <HourglassEmptyRoundedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                        <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF"}}>
                                                        Complete Math Homework
                                                        </Typography> 
                                                    </Grid>

                                                    <Grid item>
                                                        <IconButton aria-label="drag">
                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                        <IconButton sx={{}} aria-label="expandTask">
                                                            <ExpandCircleDownOutlinedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>   
                            <Box sx={{ml:3}}>
                                <Typography variant="h5" sx={{fontWeight: "bold",mt:4, fontSize:'30px'}}>
                                    Apointments
                                </Typography>                                                    
                                <Paper sx={{width: "90vh", height: "90%", borderRadius: "10px", p:2, flexWrap: 'wrap'}} elevation={12}>

                                </Paper> 
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
        </CssBaseline>
    );
}

export default TasksAppts;