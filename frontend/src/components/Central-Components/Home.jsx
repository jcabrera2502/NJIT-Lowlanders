import { onAuthStateChanged, setPersistence } from "firebase/auth";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Typography, CssBaseline, Box, MenuItem, Divider, Button, AppBar, Grid, Toolbar, Avatar, Paper, IconButton, TextField, Select, Popover, Collapse, Menu, Accordion, AccordionSummary, AccordionDetails, getSelectUtilityClasses, List, ListItem} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { getCurrentMonth, getCurrentDay, getCurrentYear} from "./date_functions";
import WebIcon from "../../Images/Logo.svg";
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenWithRoundedIcon from '@mui/icons-material/OpenWithRounded';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { set } from "mongoose";
import { PomoPopup } from "./Popup";

const TasksAppts = () => {
    const [user, setUser] = useState(null);
    const [userPresentInDatabase, setUserPresentInDatabase] = useState(false);
    const [data, setData] = useState(null);
    const [insertTaskData, setInsertTaskData] = useState(null);
    const [getUserTaskData, setGetUserTaskData] = useState(null);
    const [month, setMonth] = React.useState(getCurrentMonth);
    const [day, setDay] = React.useState(getCurrentDay);
    const [year, setYear] = React.useState(getCurrentYear);
    const [selectedDate, setSelectedDate] = React.useState(new Date(year, month - 1, day));
// Update isThisCurrent function
function isThisCurrent(date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    date.setHours(0, 0, 0, 0); // Set selected date to midnight
    //console.log("Current Date:", currentDate);
    //console.log("Selected Date:", date);
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
                //console.log("User already in database");
                //console.log(response.data);
                setData(response.data);
            }
        }
    };
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getUserTasks(user);
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
        //console.log("Selected Date:", selectedDate);
      }, [selectedDate]);
    const updateSelectedDate = (newMonth, newDay, newYear) => {
        setSelectedDate(new Date(newYear, newMonth - 1, newDay));
      };
      const handleMonthChange = (event) => {
        //console.log("Selected Date Before:", selectedDate);
        setMonth(event.target.value);
        dateRules(event.target.value, year);
        getUserTasks(user); // Add this line to fetch tasks when the day changes

        //console.log("Selected Date After:", selectedDate);
    };useEffect(() => {
        updateSelectedDate(month, day, year);
        
    }, [month, day, year]);
    //ADDITIONAL ADD
    useEffect(() => {
        getUserTasks(user);
    }, [day, month, year, user]);
    const handleDayChange = (event) => {
        setDay(event.target.value);
        updateSelectedDate(month, event.target.value, year);
        getUserTasks(user); // Add this line to fetch tasks when the day changes

    }
    const handleYearChange = (event) => {
        setYear(event.target.value);
        dateRules(month, event.target.value);
        updateSelectedDate(month, day, event.target.value);
        getUserTasks(user); // Add this line to fetch tasks when the day changes

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

    // Functions and stuff for pomo pop-up
    const [pomoOpen, setPomoOpen] = React.useState(false);
    const [focusTask, setFocusTask] = React.useState(null);
    const [focusTaskDesc, setFocusTaskDesc] = React.useState(null);
    const [focusTaskTimers, setFocusTaskTimers] = React.useState(null);

    //TODO: make these times pull from user settings
    const [taskTime, setTaskTime] = React.useState(30);
    const [shortTime, setShortTime] = React.useState(5);
    const [longTime, setLongTime] = React.useState(15);

    const handleOpenPomo = (task, desc, timers) => {
        //console.log("click");
        setFocusTask(task);
        setFocusTaskDesc(desc);
        setFocusTaskTimers(timers);
        setPomoOpen(true);
    };
    const handlePomoClose = () => {
        setPomoOpen(false);
        //console.log("close");
    };


    
    // Popup for adding Tasks
    const [anchorEl, setAnchorEl] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [numTimers, setNumTimers] = useState(1);
    const [taskNote, setTaskNote] = useState('');
    const [isExpanded, setExpanded] = useState(false);
    const [editNumTimer, setEditNumTimer] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [currentIcon, setCurrentIcon] = useState(0);

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
        setTaskTitle(''); // Clear input when the popover is closed
        setNumTimers(1);
        setTaskNote('');
      };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    //For Adding Tasks to Important
    const [subBoxes, setSubBoxes] = useState([]);
    const handleAddSubBox = () => {
        const newKey = subBoxes.length + 1;
        //loop through all the subBoxes and add the new subBox to the end
        
        setSubBoxes([...subBoxes, { key: newKey, title: taskTitle, pomTimers: numTimers, 
            note: taskNote, editNumTimer: editNumTimer, editNote: editNote, currentIcon: currentIcon }]);
        // console.log(currentIcon);
        insertUserTask(user);
        handleClosePopover();
    };

    //progress icons 

    const icons = [
        <CircleOutlinedIcon sx={{ color: 'black' }} />,
        <HourglassEmptyRoundedIcon sx={{ color: 'black' }} />,
        <CheckCircleOutlineIcon sx={{ color: 'black' }} />,
        <SyncAltIcon sx={{ color: 'black' }} />,
      ];

    //Changes progress icons
    // const iconClick = (subBox) => 
    // {
    //     setCurrentIcon((currentIcon + 1) % icons.length);
    // }
    
    // Handles dropdown menu from profile picture
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);
    const handleClick = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl2(null);
    };

    const insertUserTask = async (user) => {
        //console.log(user);

            const response = await axios.post("/api/insertTask", {
            params: 
            {
                email: user.email,
                title: taskTitle,
                type: "important",
                completed: false,
                taskNote: taskNote,
                pomodoroCount: numTimers,
                note: taskNote,
                day: day,
                month: month,
                year: year,
            } 
        });
        //Only sets the data if there is a result
        if(response){ 
            //console.log(response)
            setInsertTaskData(response.data);
        }
    };
    const getUserTasks = async (user) => {
        try {
            const response = await axios.get("/api/getTasks", {
                params: {
                    email: user.email,
                    day: day,
                    month: month,
                    year: year,
                }
            });
    
            if (response && response.data && Array.isArray(response.data)) {
                const filteredTasks = response.data.filter(task => {
                    const taskDate = new Date(task.year, task.month - 1, task.day);
                    return isSameDay(taskDate, new Date(year, month - 1, day));
                });
    
                setGetUserTaskData(filteredTasks);
                insertIntoSubBoxes(filteredTasks);
            } else {
                console.error("Invalid or missing data in the API response");
            }
        } catch (error) {
            console.error("Error fetching user tasks:", error);
        }
    }

const isSameDay = (date1, date2) => {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};

const insertIntoSubBoxes = (response) => {
    const newSubBoxes = response.map((task, index) => ({
        key: index + 1,
        title: task.taskTitle,
        pomTimers: task.pomodoroCount,
        note: task.note,
    }));

    setSubBoxes(newSubBoxes);
};

const updateUserTasks = async (user, subBox) =>
{
    const response = await axios.put("/api/updateTask", {
        params: {
            email: user.email,
            title: subBox.title,
            day: day,
            month: month,
            year: year,
            note: subBox.note,
            pomodoroCount: subBox.pomTimers,
        }
    });
    if (response) {
        //console.log(response.data);
    }
}

// Status of tasks
const taskStatus = 
{
    topPriority:
    {
        items: []
    },
    important:
    {
        items: subBoxes
    },
    other:
    {
        items: []
    }
};

// State for draggable ordering
const [priority, setPriority] = useState(taskStatus);

// Overwrites empty priority array
useEffect(() => {
    setPriority(taskStatus);
    console.log(priority);
}, [subBoxes]);

// Handles arrays for draggable objects
function handleOnDragEnd(result) {
    if(result.source.droppableId !== result.destination.droppableId)
    {
        //take array items and throw them into the appropriate arrays
    
    const sourcePriority = priority[result.source.droppableId];
    const destPriority = priority[result.destination.droppableId];
    const sourceItems = [...sourcePriority.items];
    const destItems = [...destPriority.items];
    const [removed] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, removed);
    setPriority({
      ...priority,
      [result.source.droppableId]: {
        ...sourcePriority,
        items: sourceItems
      },
      [result.destination.droppableId]: {
        ...destPriority,
        items: destItems
      }
    });
    }
     
    else 
    {
        const prio = priority[result.source.droppableId];
        const copiedItems = [...prio.items];
        const [removed] = copiedItems.splice(result.source.index, 1);
        copiedItems.splice(result.destination.index, 0, removed);
        setPriority({
          ...priority,
          [result.source.droppableId]: {
            ...prio,
            items: copiedItems
          }
        });
      }
}

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
                position: "fixed",            
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
                    <Button sx={{textTransform: "none"}} onClick={handleClick}><Avatar sx={{bgcolor: "#E8EDFF"}}><PermIdentityRoundedIcon sx={{color: "#6284FF"}} /></Avatar><Typography sx={{fontWeight: "bold", color: "black", ml: 1}}>{data?.firstName} {data?.lastName}</Typography></Button>
                    <Menu
                        id="profile-menu"
                        anchorEl={anchorEl2}
                        open={open2}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => (window.location.href = "http://localhost:3000/Profile")}>Profile</MenuItem>
                        <MenuItem onClick={() => (window.location.href = "http://localhost:3000/")}>Tasks</MenuItem>
                        <MenuItem onClick={() => (window.location.href = "http://localhost:3000/AuthDetails")}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>                 
                    <Grid item xs={10}>
                        {/* Date Navbar */}
                        <Box 
                            sx={{mt: 12, width: "100%", bgcolor: "#E8EDFF", borderRadius: 3,}}
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
                                dateRules(month - 1, year);
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
                                    {thirty.includes(month) || thirtyOne.includes(month) || (month === 2 && leap(year))
                                        ? <MenuItem value={29}>29</MenuItem>
                                        : <Typography></Typography> 
                                    }
                                    {thirty.includes(month) || thirtyOne.includes(month)
                                        ? <MenuItem value={30}>30</MenuItem>
                                        : <Typography></Typography> 
                                    }
                                    {thirtyOne.includes(month)
                                        ? <MenuItem value={31}>31</MenuItem>
                                        : <Typography></Typography> 
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
                        {/* End of Date Navbar */}

                        {/*Pomo Popup*/}
                        <PomoPopup 
                            pomoOpen={pomoOpen}
                            onPomoClose={handlePomoClose}
                            taskTitle={focusTask}
                            taskDesc={focusTaskDesc}
                            taskTimers={focusTaskTimers}
                            taskTime={taskTime}
                            shortTime={shortTime}
                            longTime={longTime}
                        />
                        {/*End of Pomo Popup*/}

                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <Box>
                                <Typography variant="h5" sx={{fontWeight: "bold",mt:2, fontSize:'30px'}}>
                                    Tasks
                                    <IconButton aria-label="addTask" onClick={handleOpenPopover}>
                                        <Avatar sx={{bgcolor: "#5D8EFF"}}><AddIcon sx={{color: "#FFF"}} /></Avatar>
                                    </IconButton>
                                    <Popover
                                      id={id}
                                      open={open}
                                      anchorEl={anchorEl}
                                      onClose={handleClosePopover}
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                    >
                                        <FormControl>
                                            <Box p={2}>
                                                <Typography sx={{mb:0.5}}>Task Title*</Typography>
                                                <TextField
                                                    sx={{mb:2}}
                                                    label="Title"
                                                    required
                                                    variant="outlined"
                                                    fullWidth
                                                    value={taskTitle}
                                                    onChange={(e) => setTaskTitle(e.target.value)}
                                                />
                                                <Typography sx={{mb:0.5}}>Number of Pomodoro Timers</Typography>
                                                <TextField
                                                    sx={{mb:2}}
                                                    type='number'
                                                    InputProps={{
                                                        inputProps: { min: 1 }
                                                    }}
                                                    label="Pomodoro Timers"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={numTimers}
                                                    onChange={(e) => {
                                                        setNumTimers(e.target.value);
                                                    }}
                                                />
                                                <Typography sx={{mb:0.5}}>Notes (Optional)</Typography>
                                                <TextField
                                                    sx={{mb:2}}
                                                    label="Note"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={taskNote}
                                                    onChange={(e) => setTaskNote(e.target.value)}
                                                    multiline
                                                />
                                                

                                                <Button type="submit" color="primary" onClick={handleAddSubBox}>
                                                    Add Task
                                                </Button>
                                            </Box>
                                        </FormControl>
                                    </Popover>
                                </Typography>
                                                                                    
                                <Paper sx={{width: "90vh", height: "100%", borderRadius: "10px", p:2, flexWrap: 'wrap'}} elevation={12}>
                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Box sx={{display: "flex", flexDirection: "column", }}>
                                        {/* Top Priority Task Box*/}
                                        <Box sx={{ 
                                            ml:2,
                                            width: "95%", 
                                            height: "100%",  
                                            bgcolor: "#F5F7F9",
                                            borderRadius: "8px",}}>
                                            <Typography sx={{ml:2,mt:2, fontWeight: 700, fontSize:'20px'}}>
                                                Top Priority
                                            </Typography>
                                            <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            flexDirection="column"
                                            >
                                                <Droppable droppableId="topPriority">
                                                {(provided) => (
                                                <List {...provided.droppableProps} ref={provided.innerRef}  sx={{width: "100%", borderRadius: 8, margin: 0, padding: 0}}>
                                                {priority.topPriority.items.length === 0 ? ( //TODO Needs to be replaced with a new array for Top Priority
                                                // Display a message when there are no sub-boxes
                                                    <Typography justifyContent={"center"} sx={{ml:2,mt:2, mb:2, fontWeight: 100, fontSize:'20px'}}>
                                                        There are Currently no Tasks in here
                                                    </Typography>
                                                ) : (

                                                    priority.topPriority.items.map((subBox, index) => (
                                                        <Draggable key={String(subBox.key)} draggableId={String(subBox.key)} index={index}>
                                                        {(provided) => (
                                                        <ListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{padding: 0, borderRadius: 8}}
                                                        >
                                                            <Box sx={{width: "100%", mb: 1}}
                                                                display="flex"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                flexDirection="column"
                                                            >
                                                            <Accordion key={subBox.key} sx={{width: "95%", borderRadius: "10px", '&:before': {display: 'none',}}} elevation={0} TransitionProps={{ unmountOnExit: true }}>

                                                                <AccordionSummary 
                                                                expandIcon={<ExpandCircleDownOutlinedIcon sx={{color: "black"}}/>}
                                                                aria-controls="panel1a-content"
                                                                sx={{ 
                                                                    width: "100%", 
                                                                    height: "3vh",  
                                                                    borderRadius: "8px",
                                                                    paddingLeft: 0,
                                                                }}
                                                                elevation={0}
                                                                >
                                                                <Toolbar disableGutters sx={{width: "100%"}}>
                                                                        <IconButton onClick={() => {
                                                                        subBox.currentIcon=(subBox.currentIcon + 1) % icons.length;
                                                                        setCurrentIcon(subBox.currentIcon);
                                                                    }}
                                                                    sx={{color: 'black'}} aria-label="icon">
                                                                            {icons[subBox.currentIcon]}
                                                                        {/* {subBox.currentIcon} */}
                                                                        </IconButton>
                                                                        <Button onClick={() => {handleOpenPomo(subBox.title, subBox.note, subBox.pomTimers)}} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", textTransform: "none", justifyContent: "flex-start"}}>
                                                                            {subBox.title}
                                                                        </Button>
                                                                        <Box sx={{flexGrow: 1}} />
                                                                        <IconButton aria-label="drag">
                                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                                        </IconButton> 
                                                                        <Box sx={{ mr: ".3em"}} />                                                                                             
                                                            </Toolbar>
                                                    
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />


                                                                    <Grid container alignItems="center">
                                                                        <Grid item xs>
                                                                            <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color:"#1F1F1F"}}>
                                                                                Number of Pomodoro Timers (30 mins each)
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item>
                                                                        {subBox.editNumTimer ? (
                                                                            <>
                                                                                <IconButton aria-label="plusTimer" onClick={() => {
                                                                                    subBox.pomTimers=subBox.pomTimers + 1;
                                                                                    setNumTimers(subBox.pomTimers);
                                                                                    updateUserTasks(user, subBox);
                                                                                }}>
                                                                                    <AddBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                                                </IconButton>

                                                                                    <Typography display={"inline"} sx={{ fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                                                        {subBox.pomTimers}
                                                                                    </Typography>

                                                                                <IconButton aria-label="minusTimer" onClick={() => {
                                                                                if(subBox.pomTimers > 1){
                                                                                        subBox.pomTimers= subBox.pomTimers - 1;
                                                                                        setNumTimers(subBox.pomTimers);
                                                                                        updateUserTasks(user, subBox);
                                                                                }
                                                                                }}>
                                                                                    <IndeterminateCheckBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                                                </IconButton>

                                                                                <IconButton aria-label="editingTimers" onClick={() => {
                                                                                subBox.editNumTimer=!(subBox.editNumTimer);
                                                                                setEditNumTimer(subBox.editNumTimer);
                                                                            }}>
                                                                                    <CheckBoxRoundedIcon sx={{color:"#6284FF"}} />
                                                                                </IconButton>
                                                                            </>
                                                                            ) : (
                                                                            <>
                                                                                <Typography display={"inline"} sx={{ fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                                                    {subBox.pomTimers}
                                                                                </Typography>
                                                                            
                                                                                <IconButton sx={{ml: 2}} aria-label="editNumOfTimers" onClick={() => {
                                                                                subBox.editNumTimer=!(subBox.editNumTimer);
                                                                                setEditNumTimer(subBox.editNumTimer);
                                                                            }}>
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}} />
                                                                                    </IconButton>
                                                                            </>
                                                                        )}
                                                                        </Grid>
                                                                    </Grid> 
                                                                {subBox.editNote ? (
                                                                    <>
                                                                        <Grid container alignItems="center">
                                                                            <Grid item xs>
                                                                                <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color:"#545454"}}>
                                                                                    Notes (Editing)
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <IconButton aria-label="editingTimers" onClick={() => {
                                                                                subBox.editNote=!(subBox.editNote);
                                                                                setEditNote(subBox.editNote);
                                                                            }}>
                                                                                    <CheckBoxRoundedIcon sx={{color:"#6284FF"}} />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                
                                                                                <TextField
                                                                                    label="Note"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                    defaultValue={subBox.note}
                                                                                    onChange={(e) => {
                                                                                        subBox.note= e.target.value;
                                                                                        setTaskNote(subBox.note)
                                                                                        updateUserTasks(user, subBox);
                                                                                    }}
                                                                                    multiline
                                                                                />
                                                                        </Box>
                                                                    </>
                                                                    ) : (
                                                                        <>
                                                                            <Grid container alignItems="center">
                                                                                <Grid item xs>
                                                                                    <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color:"#545454"}}>
                                                                                        Notes
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <IconButton sx={{ml: 2}} aria-label="editNote">
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}} onClick={() => {
                                                                                        subBox.editNote=!(subBox.editNote);
                                                                                        setEditNote(subBox.editNote);
                                                                                    }} />
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                                <Typography display={"inline"} sx={{fontWeight: 700, fontSize:'14px', color:"#1F1F1F"}}>
                                                                                    {subBox.note}
                                                                                </Typography>    
                                                                            </Box> 
                                                                        </>
                                                                    )}
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </Box>
                                                        </ListItem>
                                                        )}
                                                        </Draggable>
                                                    ))
                                                )}
                                                {provided.placeholder}
                                                </List>
                                                )}
                                                </Droppable>
                                            </Box>
                                        </Box>
                                        

                                        { /* Important Task Box*/}
                                        
                                        <Box sx={{ 
                                            mt:1,
                                            ml:2,
                                            width: "95%", 
                                            height: "100%",  
                                            bgcolor: "#F5F7F9",
                                            borderRadius: "8px",
                                            }}
                                        >
                                            <Typography sx={{ml:2,mt:2, mb:1, fontWeight: 700, fontSize:'20px'}}>
                                                Important
                                            </Typography>

                                            <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            flexDirection="column"
                                            >
                                            <Droppable droppableId="important">
                                            {(provided) => (
                                            <List {...provided.droppableProps} ref={provided.innerRef}  sx={{width: "100%", borderRadius: 8, margin: 0, padding: 0}}>
                                                {priority.important.items.length === 0 ? (
                                                // Display a message when there are no sub-boxes
                                                    <Typography justifyContent={"center"} sx={{ml:2,mt:2, mb:2, fontWeight: 100, fontSize:'20px'}}>
                                                        There are Currently no Tasks in here
                                                    </Typography>
                                                ) : (
                                                    // Display sub-boxes when there are some
                                                    
                                                    // Task module starts here
                                                    priority.important.items.map((subBox, index) => (
                                                        <Draggable key={String(subBox.key)} draggableId={String(subBox.key)} index={index}>
                                                        {(provided) => (
                                                        <ListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{padding: 0, borderRadius: 8}}
                                                        >
                                                            <Box sx={{width: "100%", mb: 1}}
                                                                display="flex"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                flexDirection="column"
                                                            >
                                                            <Accordion key={subBox.key} sx={{width: "95%", borderRadius: "10px", '&:before': {display: 'none',}}} elevation={0} TransitionProps={{ unmountOnExit: true }}>

                                                                <AccordionSummary 
                                                                expandIcon={<ExpandCircleDownOutlinedIcon sx={{color: "black"}}/>}
                                                                aria-controls="panel1a-content"
                                                                sx={{ 
                                                                    width: "100%", 
                                                                    height: "3vh",  
                                                                    borderRadius: "8px",
                                                                    paddingLeft: 0,
                                                                }}
                                                                elevation={0}
                                                                >
                                                                <Toolbar disableGutters sx={{width: "100%"}}>
                                                                        <IconButton onClick={() => {
                                                                        subBox.currentIcon=(subBox.currentIcon + 1) % icons.length;
                                                                        setCurrentIcon(subBox.currentIcon);
                                                                    }}
                                                                    sx={{color: 'black'}} aria-label="icon">
                                                                            {icons[subBox.currentIcon]}
                                                                        {/* {subBox.currentIcon} */}
                                                                        </IconButton>
                                                                        <Button onClick={() => {handleOpenPomo(subBox.title, subBox.note, subBox.pomTimers)}} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", textTransform: "none", justifyContent: "flex-start"}}>
                                                                            {subBox.title}
                                                                        </Button>
                                                                        <Box sx={{flexGrow: 1}} />
                                                                        <IconButton aria-label="drag">
                                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                                        </IconButton> 
                                                                        <Box sx={{ mr: ".3em"}} />                                                                                             
                                                            </Toolbar>
                                                    
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />


                                                                    <Grid container alignItems="center">
                                                                        <Grid item xs>
                                                                            <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color:"#1F1F1F"}}>
                                                                                Number of Pomodoro Timers (30 mins each)
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item>
                                                                        {subBox.editNumTimer ? (
                                                                            <>
                                                                                <IconButton aria-label="plusTimer" onClick={() => {
                                                                                    subBox.pomTimers=subBox.pomTimers + 1;
                                                                                    setNumTimers(subBox.pomTimers);
                                                                                    updateUserTasks(user, subBox);
                                                                                }}>
                                                                                    <AddBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                                                </IconButton>

                                                                                    <Typography display={"inline"} sx={{ fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                                                        {subBox.pomTimers}
                                                                                    </Typography>

                                                                                <IconButton aria-label="minusTimer" onClick={() => {
                                                                                if(subBox.pomTimers > 1){
                                                                                        subBox.pomTimers= subBox.pomTimers - 1;
                                                                                        setNumTimers(subBox.pomTimers);
                                                                                        updateUserTasks(user, subBox);
                                                                                }
                                                                                }}>
                                                                                    <IndeterminateCheckBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                                                </IconButton>

                                                                                <IconButton aria-label="editingTimers" onClick={() => {
                                                                                subBox.editNumTimer=!(subBox.editNumTimer);
                                                                                setEditNumTimer(subBox.editNumTimer);
                                                                            }}>
                                                                                    <CheckBoxRoundedIcon sx={{color:"#6284FF"}} />
                                                                                </IconButton>
                                                                            </>
                                                                            ) : (
                                                                            <>
                                                                                <Typography display={"inline"} sx={{ fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                                                    {subBox.pomTimers}
                                                                                </Typography>
                                                                            
                                                                                <IconButton sx={{ml: 2}} aria-label="editNumOfTimers" onClick={() => {
                                                                                subBox.editNumTimer=!(subBox.editNumTimer);
                                                                                setEditNumTimer(subBox.editNumTimer);
                                                                            }}>
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}} />
                                                                                    </IconButton>
                                                                            </>
                                                                        )}
                                                                        </Grid>
                                                                    </Grid> 
                                                                {subBox.editNote ? (
                                                                    <>
                                                                        <Grid container alignItems="center">
                                                                            <Grid item xs>
                                                                                <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color:"#545454"}}>
                                                                                    Notes (Editing)
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <IconButton aria-label="editingTimers" onClick={() => {
                                                                                subBox.editNote=!(subBox.editNote);
                                                                                setEditNote(subBox.editNote);
                                                                            }}>
                                                                                    <CheckBoxRoundedIcon sx={{color:"#6284FF"}} />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                
                                                                                <TextField
                                                                                    label="Note"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                    defaultValue={subBox.note}
                                                                                    onChange={(e) => {
                                                                                        subBox.note= e.target.value;
                                                                                        setTaskNote(subBox.note)
                                                                                        updateUserTasks(user, subBox);
                                                                                    }}
                                                                                    multiline
                                                                                />
                                                                        </Box>
                                                                    </>
                                                                    ) : (
                                                                        <>
                                                                            <Grid container alignItems="center">
                                                                                <Grid item xs>
                                                                                    <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color:"#545454"}}>
                                                                                        Notes
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <IconButton sx={{ml: 2}} aria-label="editNote">
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}} onClick={() => {
                                                                                        subBox.editNote=!(subBox.editNote);
                                                                                        setEditNote(subBox.editNote);
                                                                                    }} />
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                                <Typography display={"inline"} sx={{fontWeight: 700, fontSize:'14px', color:"#1F1F1F"}}>
                                                                                    {subBox.note}
                                                                                </Typography>    
                                                                            </Box> 
                                                                        </>
                                                                    )}
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </Box>
                                                        </ListItem>
                                                        )}
                                                        </Draggable>
                                                    ))
                                                    // Task module Ends here
                                                )}
                                                {provided.placeholder}
                                            </List>
                                            )}    
                                            </Droppable>
                                            </Box>
                                            
                                        </Box>

                                        {/* Other Task Box */}
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

                                            <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            flexDirection="column"
                                            >
                                                <Droppable droppableId="other">
                                                {(provided) => (
                                                <List {...provided.droppableProps} ref={provided.innerRef}  sx={{width: "100%", borderRadius: 8, margin: 0, padding: 0}}>
                                                {priority.other.items.length === 0 ? ( //TODO Needs to be replaced with a new array for Top Priority
                                                // Display a message when there are no sub-boxes
                                                    <Typography justifyContent={"center"} sx={{ml:2,mt:2, mb:2, fontWeight: 100, fontSize:'20px'}}>
                                                        There are Currently no Tasks in here
                                                    </Typography>
                                                ) : (
                                                    // Display sub-boxes when there are some
                                                    priority.other.items.map((subBox, index) => (
                                                        <Draggable key={String(subBox.key)} draggableId={String(subBox.key)} index={index}>
                                                        {(provided) => (
                                                        <ListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{padding: 0, borderRadius: 8}}
                                                        >
                                                            <Box sx={{width: "100%", mb: 1}}
                                                                display="flex"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                flexDirection="column"
                                                            >
                                                            <Accordion key={subBox.key} sx={{width: "95%", borderRadius: "10px", '&:before': {display: 'none',}}} elevation={0} TransitionProps={{ unmountOnExit: true }}>

                                                                <AccordionSummary 
                                                                expandIcon={<ExpandCircleDownOutlinedIcon sx={{color: "black"}}/>}
                                                                aria-controls="panel1a-content"
                                                                sx={{ 
                                                                    width: "100%", 
                                                                    height: "3vh",  
                                                                    borderRadius: "8px",
                                                                    paddingLeft: 0,
                                                                }}
                                                                elevation={0}
                                                                >
                                                                <Toolbar disableGutters sx={{width: "100%"}}>
                                                                        <IconButton onClick={() => {
                                                                        subBox.currentIcon=(subBox.currentIcon + 1) % icons.length;
                                                                        setCurrentIcon(subBox.currentIcon);
                                                                    }}
                                                                    sx={{color: 'black'}} aria-label="icon">
                                                                            {icons[subBox.currentIcon]}
                                                                        {/* {subBox.currentIcon} */}
                                                                        </IconButton>
                                                                        <Button onClick={() => {handleOpenPomo(subBox.title, subBox.note, subBox.pomTimers)}} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", textTransform: "none", justifyContent: "flex-start"}}>
                                                                            {subBox.title}
                                                                        </Button>
                                                                        <Box sx={{flexGrow: 1}} />
                                                                        <IconButton aria-label="drag">
                                                                            <OpenWithRoundedIcon sx={{ color:"black"}} />
                                                                        </IconButton> 
                                                                        <Box sx={{ mr: ".3em"}} />                                                                                             
                                                            </Toolbar>
                                                    
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />


                                                                    <Grid container alignItems="center">
                                                                        <Grid item xs>
                                                                            <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color:"#1F1F1F"}}>
                                                                                Number of Pomodoro Timers (30 mins each)
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item>
                                                                        {subBox.editNumTimer ? (
                                                                            <>
                                                                                <IconButton aria-label="plusTimer" onClick={() => {
                                                                                    subBox.pomTimers=subBox.pomTimers + 1;
                                                                                    setNumTimers(subBox.pomTimers);
                                                                                    updateUserTasks(user, subBox);
                                                                                }}>
                                                                                    <AddBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                                                </IconButton>

                                                                                    <Typography display={"inline"} sx={{ fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                                                        {subBox.pomTimers}
                                                                                    </Typography>

                                                                                <IconButton aria-label="minusTimer" onClick={() => {
                                                                                if(subBox.pomTimers > 1){
                                                                                        subBox.pomTimers= subBox.pomTimers - 1;
                                                                                        setNumTimers(subBox.pomTimers);
                                                                                        updateUserTasks(user, subBox);
                                                                                }
                                                                                }}>
                                                                                    <IndeterminateCheckBoxOutlinedIcon sx={{color:"#9FA3A8"}} />
                                                                                </IconButton>

                                                                                <IconButton aria-label="editingTimers" onClick={() => {
                                                                                subBox.editNumTimer=!(subBox.editNumTimer);
                                                                                setEditNumTimer(subBox.editNumTimer);
                                                                            }}>
                                                                                    <CheckBoxRoundedIcon sx={{color:"#6284FF"}} />
                                                                                </IconButton>
                                                                            </>
                                                                            ) : (
                                                                            <>
                                                                                <Typography display={"inline"} sx={{ fontWeight: 500, fontSize:'16px', color:"#FE754D"}}>
                                                                                    {subBox.pomTimers}
                                                                                </Typography>
                                                                            
                                                                                <IconButton sx={{ml: 2}} aria-label="editNumOfTimers" onClick={() => {
                                                                                subBox.editNumTimer=!(subBox.editNumTimer);
                                                                                setEditNumTimer(subBox.editNumTimer);
                                                                            }}>
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}} />
                                                                                    </IconButton>
                                                                            </>
                                                                        )}
                                                                        </Grid>
                                                                    </Grid> 
                                                                {subBox.editNote ? (
                                                                    <>
                                                                        <Grid container alignItems="center">
                                                                            <Grid item xs>
                                                                                <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color:"#545454"}}>
                                                                                    Notes (Editing)
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <IconButton aria-label="editingTimers" onClick={() => {
                                                                                subBox.editNote=!(subBox.editNote);
                                                                                setEditNote(subBox.editNote);
                                                                            }}>
                                                                                    <CheckBoxRoundedIcon sx={{color:"#6284FF"}} />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                
                                                                                <TextField
                                                                                    label="Note"
                                                                                    variant="outlined"
                                                                                    fullWidth
                                                                                    defaultValue={subBox.note}
                                                                                    onChange={(e) => {
                                                                                        subBox.note= e.target.value;
                                                                                        setTaskNote(subBox.note)
                                                                                        updateUserTasks(user, subBox);
                                                                                    }}
                                                                                    multiline
                                                                                />
                                                                        </Box>
                                                                    </>
                                                                    ) : (
                                                                        <>
                                                                            <Grid container alignItems="center">
                                                                                <Grid item xs>
                                                                                    <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color:"#545454"}}>
                                                                                        Notes
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <IconButton sx={{ml: 2}} aria-label="editNote">
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}} onClick={() => {
                                                                                        subBox.editNote=!(subBox.editNote);
                                                                                        setEditNote(subBox.editNote);
                                                                                    }} />
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                                <Typography display={"inline"} sx={{fontWeight: 700, fontSize:'14px', color:"#1F1F1F"}}>
                                                                                    {subBox.note}
                                                                                </Typography>    
                                                                            </Box> 
                                                                        </>
                                                                    )}
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </Box>
                                                        </ListItem>
                                                        )}
                                                        </Draggable>
                                                    ))
                                                    
                                                )}
                                                {provided.placeholder}
                                                </List>
                                                )}
                                                </Droppable>
                                            </Box>  
                                        </Box>
                                    </Box>
                                    </DragDropContext>
                                </Paper>
                            </Box>   
                            
                            {/* Appointments */}
                            <Box sx={{ml:3}}>
                                <Typography variant="h5" sx={{fontWeight: "bold",mt:3,mb:1, fontSize:'30px'}}>
                                    Appointments
                                </Typography>                                                    
                                <Paper sx={{width: "100%", height: "100%", borderRadius: "10px", p:2, flexWrap: 'wrap'}} elevation={12}>
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

                                                        <IconButton sx={{}}  aria-label="expandTask" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                                                            <ExpandCircleDownOutlinedIcon sx={{ color:"black"}} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>                                                                                                

                                                <Collapse in={isExpanded}>
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
                                                </Collapse>
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
                        </Box>
                    </Grid>
                </Grid>
        </CssBaseline>
    );
}

export default TasksAppts;