import { onAuthStateChanged } from "firebase/auth";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../firebase";
import { Typography, CssBaseline, Box, MenuItem, Divider, Button, AppBar, Grid, 
         Toolbar, Avatar, Paper, IconButton, TextField, Select, Popover, 
         Menu, Accordion, AccordionSummary, AccordionDetails, Stack, 
         List, ListItem, duration} from "@mui/material";
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
import PomoPopup  from "./Popup";
import CircleIcon from '@mui/icons-material/Circle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const Home = () => { 
    const theme = JSON.parse(localStorage.getItem(`theme`));
    const [user, setUser] = useState(null);
    const [userPresentInDatabase, setUserPresentInDatabase] = useState(false);
    const [data, setData] = useState(null);
    const [insertTaskData, setInsertTaskData] = useState(null);
    const [getUserTaskData, setGetUserTaskData] = useState(null);
    const [getUserTasksPreviousDayData, setGetUserTasksPreviousDayData] = useState(null);
    const [month, setMonth] = React.useState(getCurrentMonth);
    const [day, setDay] = React.useState(getCurrentDay);
    const [year, setYear] = React.useState(getCurrentYear);
    const [selectedDate, setSelectedDate] = React.useState(new Date(year, month - 1, day));
    const [nonRecurringEvents, setNonRecurringEvents] = useState([]);
    const [recurringEvents, setRecurringEvents] = useState([]);
    const currentTime = new Date();
    const [appointmentList, setAppointmentList] = useState([]);
    const [oappointmentList, setoAppointmentList] = useState([]);
    const [allDayappts, setAllDayAppts] = useState([]);
    const [planDay, setPlanDay] = useState(false);

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
                //set taskTime, shortTime, longTime after converting to an int
                setTaskTime(parseInt(response.data.pomodoro));
                setShortTime(parseInt(response.data.shortBreak));
                setLongTime(parseInt(response.data.longBreak));
                //console.log("TASK TIME",taskTime);
                //console.log("SHORT TIME",shortTime);
                //console.log("LONG TIME",longTime);
                //console.log("-------------------------")
                //console.log("TASK TIME",response.data.pomodoro);
                //console.log("SHORT TIME",response.data.shortBreak);
                //console.log("LONG TIME",response.data.longBreak);
                //reload the page to update the state
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
                window.location.href = "/SignIn";  

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
        //console.log("THIS IS THE DAY",day);
        //console.log("THIS IS THE MONTH",month);
        //console.log("THIS IS THE YEAR",year);
        if(JSON.parse(localStorage.getItem(`${day}-${month}-${year}plan`)))
        {
            setPlanDay(JSON.parse(localStorage.getItem(`${day}-${month}-${year}plan`)));
        }
        else
        {
            setPlanDay(false);
        }
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
    // const [focusUsedTimers, setFocusUsedTimers] = React.useState(null);
    const [focusSubBox, setFocusSubBox] = React.useState(null);

    //TODO: make these times pull from user settings
    const [taskTime, setTaskTime] = React.useState(1);
    const [shortTime, setShortTime] = React.useState(5);
    const [longTime, setLongTime] = React.useState(15);

    // setTaskTime(1);
    // setShortTime(1);
    // setLongTime(1);


    useEffect(() => {setTaskTime(taskTime)}, [taskTime]);
    useEffect(() => {setShortTime(shortTime)}, [shortTime]);
    useEffect(() => {setLongTime(longTime)}, [longTime]);

    const handleOpenPomo = (task, desc, timers, subBox) => {
        //console.log("click");
        setTaskTime(taskTime);
        setShortTime(shortTime);
        setLongTime(longTime);
        setFocusTask(task);
        setFocusTaskDesc(desc);
        setFocusTaskTimers(timers);
        setPomoOpen(true);
        setFocusSubBox(subBox);
    };
    const handlePomoClose = () => {
        updateUserTasks(user, focusSubBox);
        setPomoOpen(false);
        if(planDay)
        {
            addFocusTime();
        }   
        
    };
    // get current time
    var systemTime = new Date();
    // function getCurrentTime() {
    //     systemTime = new Date();
    //     // var hours = systemTime.getHours();
    //     // var minutes = systemTime.getMinutes();
    //     // var ampm = hours >= 12 ? 'PM' : 'AM';
    //     // hours = hours % 12;
    //     // hours = hours ? hours : 12;
    //     // minutes = minutes < 10 ? '0' + minutes : minutes;
    //     // systemTime = hours + ':' + minutes + ' ' + ampm;
    //     return systemTime;
    // }
    function updateClock() {
        systemTime = new Date();
        systemTime = systemTime.getHours();
        console.log("this is da time", systemTime);
    }
    // reset systemTimer every 1 second
    setInterval(updateClock, 1000);

    //click on popup automatically when time arrives
    const iconButtonRef = useRef(null);
    // const handleIconClick = () => {
    //     const currTaskTime= subBoxes.filter(function(subBox){return (subBox.title===(taskTitle))})
    //     // Check the condition before clicking
    //     if (  && iconButtonRef.current) {
    //       // Call the click method on the IconButton
    //       iconButtonRef.current.click();
    //       iconButtonRef = useRef(null);
    //     }
    //   };
    


    
    // Popup for adding Tasks
    const [anchorEl, setAnchorEl] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [numTimers, setNumTimers] = useState(1);
    const [taskNote, setTaskNote] = useState('');
    const [expand, setExpand] = useState(false);
    const [editNumTimer, setEditNumTimer] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [currentIcon, setCurrentIcon] = useState(0);
    const [usedTimers, setUsedTimers] = useState(0);

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
        fetchUserData(user);
        setTaskTime(taskTime);
        setShortTime(shortTime);
        setLongTime(longTime);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
        setTaskTitle(''); // Clear input when the popover is closed
        setNumTimers(1);
        setTaskNote('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const titles= subBoxes.filter(function(subBox){return (subBox.title===(taskTitle))});
        // console.log(titles)
        // console.log(taskTitle)
        if (titles.length === 0) {
            handleAddSubBox();
        } 
      };
    

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    //For Adding Tasks to Important
    const [subBoxes, setSubBoxes] = useState([]);
    const [subBoxesImportant, setSubBoxesImportant] = useState([]);
    const [subBoxesTopPriority, setSubBoxesTopPriority] = useState([]);
    const [subBoxesOther, setSubBoxesOther] = useState([]);

    const handleAddSubBox = () => {
        const newKey = subBoxes.length + 1;
        //loop through all the subBoxes and add the new subBox to the end
        
        setSubBoxes([...subBoxes, { key: newKey, title: taskTitle, pomTimers: numTimers, 
            note: taskNote, editNumTimer: editNumTimer, editNote: editNote, 
            currentIcon: currentIcon, type: 'important', exp: expand, usedTimers: usedTimers }]);
        // console.log(currentIcon);
        setSubBoxesImportant([...subBoxesImportant, { key: newKey, title: taskTitle, pomTimers: numTimers, 
            note: taskNote, editNumTimer: editNumTimer, editNote: editNote, 
            currentIcon: currentIcon, type: 'important', exp: expand, usedTimers: usedTimers }]);
        insertUserTask(user, newKey);
        handleClosePopover();
    };

    //progress icons 

    const icons = [
        <CircleOutlinedIcon sx={{ color: theme ? "#fff" : "black" }} />,
        <HourglassEmptyRoundedIcon sx={{ color: theme ? "#fff" : "black" }} />,
        <CheckCircleOutlineIcon sx={{ color: theme ? "#fff" : "black" }} />,
        <SyncAltIcon sx={{ color: theme ? "#fff" : "black" }} />,
        <CancelOutlinedIcon sx={{ color: theme ? "#fff" : "black" }}/>
      ];
    
    // Handles dropdown menu from profile picture
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);
    const handleClick = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl2(null);
    };

    const insertUserTask = async (user, key) => {
        //console.log(user);

            const response = await axios.post("/api/insertTask", {
            params: 
            {
                key: key,
                email: user.email,
                title: taskTitle,
                type: 'important',
                completed: false,
                taskNote: taskNote,
                pomodoroCount: numTimers,
                note: taskNote,
                day: day,
                month: month,
                year: year,
                status: 0,
                usedTimers: usedTimers,
            } 
        });
        //Only sets the data if there is a result
        if(response){ 
            //console.log(response)
            setInsertTaskData(response.data);
        }
    };


/*

    const handleConnectClick = async () => {
        try {
        const response = await axios.get('/google', { withCredentials: true });

        //http://localhost:3001/google-proxy
        //console.log("THIS IS THE RESPONSE FROM GOOGLE",response.data);
        //console.log("I AM INSIDE THE HANDLE CONNECT CLICK FUNCTION")
        // Redirect the user to the authorization URL received from the server
        window.location.href = response.data.url;
        } catch (error) {
        console.error('Error connecting to Google Calendar:', error.message);
        }
    };
    */ 
       
      
const getUserTasks = async (user) => {
    if (!user) {
        return;
    }

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
            insertIntoSubBoxesImportant(filteredTasks.filter(task => task.type === "important"));
            insertIntoSubBoxesTopPriority(filteredTasks.filter(task => task.type === "topPriority"));
            insertIntoSubBoxesOther(filteredTasks.filter(task => task.type === "other"));
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
        type: task.type,
        currentIcon: task.status,
        usedTimers: task.usedTimers,
    }));

    setSubBoxes(newSubBoxes);
};
//fix the index so it is not overlapped with the other subBoxes

const insertIntoSubBoxesImportant = (response) => {
    const newSubBoxesImportant = response.map((task) => ({
        key: task.key,
        title: task.taskTitle,
        pomTimers: task.pomodoroCount,
        note: task.note,
        type: task.type,
        currentIcon: task.status,
        usedTimers: task.usedTimers,
        exp: expand,
    }));
    setSubBoxesImportant(newSubBoxesImportant);
};

const insertIntoSubBoxesTopPriority = (response) => {
    const newSubBoxesTopPriority = response.map((task) => ({
        key: task.key,
        title: task.taskTitle,
        pomTimers: task.pomodoroCount,
        note: task.note,
        type: task.type,
        currentIcon: task.status,
        usedTimers: task.usedTimers,
        exp: expand,
    }));
    setSubBoxesTopPriority(newSubBoxesTopPriority);
};

const insertIntoSubBoxesOther = (response) => {
    const newSubBoxesOther = response.map((task) => ({
        key: task.key,
        title: task.taskTitle,
        pomTimers: task.pomodoroCount,
        note: task.note,
        type: task.type,
        currentIcon: task.status,
        usedTimers: task.usedTimers,
        exp: expand,
    }));
    setSubBoxesOther(newSubBoxesOther);
};

const updateUserTasks = async (user, subBox) =>
{
    const response = await axios.put("/api/updateTask", {
        params: {
            key: subBox.key,
            email: user.email,
            title: subBox.title,
            type: subBox.type,
            day: day,
            month: month,
            year: year,
            note: subBox.note,
            pomodoroCount: subBox.pomTimers,
            status: subBox.currentIcon,
            usedTimers: subBox.usedTimers,
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
        items: subBoxesTopPriority // Replace with query of tasks with "topPriority" as type
    },
    important:
    {
        items: subBoxesImportant // Replace with query of tasks with "important" as type
    },
    other:
    {
        items:  subBoxesOther // Replace with query of tasks with "other" as type
    }
};

// State for draggable ordering
const [priority, setPriority] = useState(taskStatus);

// Overwrites empty priority array
useEffect(() => {
    setPriority(taskStatus);
}, [subBoxes, subBoxesImportant, subBoxesTopPriority, subBoxesOther]);

useEffect(() => {
    setSubBoxesImportant(priority.important.items);
    setSubBoxesTopPriority(priority.topPriority.items);
    setSubBoxesOther(priority.other.items);
    if(planDay)
    {
        // console.log("Priority Change");
        // addFocusTime();
    }
}, [priority]);
// Handles arrays for draggable objects
// NOTE: Draggable ID matches subBox key, we can keep track of tasks like this
function handleOnDragEnd(result) {
    if(!result.destination)
    {
        return;
    }
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
        subBoxes[result.draggableId-1].type = result.destination.droppableId;
        updateUserTasks(user, subBoxes[result.draggableId-1]);
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

function dropdownClick(subBox)
{
    subBox.exp = !(subBox.exp);
    setExpand(subBox.exp);
}

/*
BEGINNING OF GOOGLE API STUFF


*/
const [events, setEvents] = useState([]);
const [errorMessage, setErrorMessage] = useState(""); // Add this state variable

const [user2, setUser2] = useState({});
const [accessToken, setAccessToken, storedAccessToken2] = useState(() => {
  // Initialize from localStorage or default to null
  return localStorage.getItem("accessToken") || null;
});
const [userEmail, setUserEmail] = useState(() => {
  // Initialize from localStorage or default to an empty string
  return localStorage.getItem("userEmail") || "";
});
const [expire, setExpires_in] = useState(() => {
    // Initialize from localStorage expires default to an empty string
    return localStorage.getItem("expires_in") || "";
  });
const [oauthCalled, setOauthCalled] = useState(() => {
  // Initialize from localStorage or default to false
  return JSON.parse(localStorage.getItem("oauthCalled")) || false;
});

const isSignInExpired = (signInTimestamp) => {
    const expirationTime = +signInTimestamp + 3599; // or use parseInt(signInTimestamp, 10) + 3599;
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    //console.log('Expiration Time:', expirationTime, 'Current Time:', currentTime);
    return expirationTime < currentTime;
};
//idk if this works yet
const handleSignOut = async (event) => {
    // Clear localStorage values
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("oauthCalled");
    localStorage.removeItem("signInTimestamp"); // Remove the sign-in timestamp
  
    // Revoke the access token
    if (accessToken) {
      try {
        const revokeEndpoint = 'https://accounts.google.com/o/oauth2/revoke';
        const revokeUrl = `${revokeEndpoint}?token=${accessToken}`;
        await fetch(revokeUrl, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        //console.log('Access token revoked successfully');
      } catch (error) {
        console.error('Error revoking access token:', error);
      }
    }
  
    // Set state after asynchronous operations have completed
    setUser2({});
    setAccessToken(null);
    setUserEmail("");
    setOauthCalled(false);
  
    // Other cleanup or redirection logic can be added here
    const signInDiv = document.getElementById("signInDiv");
    //console.log("signInDiv:", signInDiv);
  
    // Check if the element exists before setting properties
    if (signInDiv) {
      signInDiv.hidden = false;
    } else {
      //console.error("Element with ID 'signInDiv' not found.");
    }
  
    // Clear the URL
    window.history.pushState({}, document.title, window.location.origin + window.location.pathname);
  };
//instead of signing in multiple times, just sign in once and then use the access token to get the calendar events

  useEffect(() => {
    //console.log("We ENTERED THE USE EFFECT")
    const fetchData = async () => {
        // Check if the page was redirected from OAuth provider
        const searchParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = searchParams.get("access_token");
        const expire = searchParams.get("expires_in");
        
        if (accessToken) {
            // The page was redirected from OAuth provider
            saveOauthCalledToStorage(true);

            try {
                const emailSite = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`;
                const emailFetch = await fetch(emailSite);
                const emailData = await emailFetch.json();
                const userEmail = emailData.email;

                // Make the Google Calendar API request
                const calendarApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${userEmail}/events?access_token=${accessToken}&q=Appointment`;
                const response = await fetch(calendarApiUrl);
                const data = await response.json();

                // Log and process the Google Calendar API response
                console.log("Google Calendar API Response:", data);
                //console.log("RIGHT AFTER GOOGLE CAL RESPONSE TOKEN",storedAccessToken2);
                listUpcomingEvents(data.items);

                // Set the access token, user email, and expiration time in state
                setAccessToken(accessToken);
                setUserEmail(userEmail);
                setExpires_in(expire);

                // Store the values in localStorage
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("userEmail", userEmail);
                localStorage.setItem("expires_in", expire);

                // Clear the URL
                window.history.pushState({}, document.title, window.location.origin + window.location.pathname);
            } catch (e) {
                console.log("Error:", e);
                setErrorMessage("Error: Unable to fetch data. Please try again.");
                handleSignOut();
            }
        } else {
            // The page was not redirected from OAuth provider
            // Try to get access token from localStorage
            const storedAccessToken = localStorage.getItem("accessToken");
            const storedEmail = localStorage.getItem("userEmail");
            const storedSignInTimestamp = localStorage.getItem("expires_in");

            if (storedAccessToken ) {
                // The stored access token exists and is not expired
                // Continue with your existing logic...
                try {
                    //console.log("RIGHT AFTER GOOGLE CAL RESPONSE TOKEN",storedAccessToken);
                    //console.log("RIGHT AFTER GOOGLE CAL OG ACCESS TOKEN",accessToken);

                    const emailSite = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${storedAccessToken}`;
                    const emailFetch = await fetch(emailSite);
                    const emailData = await emailFetch.json();
                    const userEmail = emailData.email;

                    const today = new Date(year, month - 1, day);
                    const tomorrow = new Date(year, month - 1, day)
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const minDateTime = today.toISOString();
                    const maxDateTime = tomorrow.toISOString();

                    // Make the Google Calendar API request
                    const calendarApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${userEmail}/events?access_token=${storedAccessToken}&q=Appointment&timeMin=${encodeURIComponent(minDateTime)}&timeMax=${encodeURIComponent(maxDateTime)}`;
                    const response = await fetch(calendarApiUrl);
                    const data = await response.json();
                    //console.log("HERE IS THE DATA")

                    // Log and process the Google Calendar API response
                    //console.log("Google Calendar API Response:", data);
                 
                    listUpcomingEvents(data.items);

                    // Set the access token, user email, and expiration time in state
                    setAccessToken(storedAccessToken);
                    setUserEmail(userEmail);
                    setExpires_in(storedSignInTimestamp);

                    // Clear the URL
                    window.history.pushState({}, document.title, window.location.origin + window.location.pathname);
                } catch (e) {
                    console.log("Error:", e);
                    setErrorMessage("Error: Unable to fetch data. Please try again.");
                    handleSignOut();
                }
            } else {
                //console.log("No valid access token available.");
            }
        }
    };

    fetchData();
}, [oauthCalled,day,month,year]);

useEffect(() => {
    // Check if the page was redirected from OAuth provider
    if (window.location.hash.includes("access_token")) {
      setOauthCalled(true);
    }
  }, []); // Run once when the component mounts




//this function just extracts the yeaar,month,day from the startDate field in the json
const parseAndDisplayDateTime = (dateTimeString) => {
    const startDate = new Date(dateTimeString);
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const day = startDate.getDate();
  
    return (
      <div>
        <p>Year: {year}</p>
        <p>Month: {month}</p>
        <p>Day: {day}</p>
      </div>
    );
  };

  //saving the state of the bool var
const saveOauthCalledToStorage = (value) => {
  setOauthCalled(value);
  localStorage.setItem("oauthCalled", JSON.stringify(value));
};


//this function lists the events returned from the google calendar api
const listUpcomingEvents = (eventsData) => {
    //console.log("Setting events:", eventsData);
  
    // Separate recurring and non-recurring events
    const recurring = [];
    const nonRecurring = [];
  
    eventsData.forEach((event) => {

    nonRecurring.push(event);  
    });
  
    setRecurringEvents(recurring);
    setNonRecurringEvents(nonRecurring);
  };

  //this function is called when the user clicks the sign in button
function oauthSignIn() {
    //setOauthCalled(true); // Update the state to true
    saveOauthCalledToStorage(true);
  
    if(oauthCalled){
      //console.log("OAUTH CALLED IN OAUTH SIGN IN");
  
      
    }
    else{
      //console.log("OAUTH NOT CALLED IN OAUTH SIGN IN");
    }
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
  
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
      'client_id': '150401460223-dpijoj0c3f8qqbref8j00kqqbn460qgf.apps.googleusercontent.com',
    //   'redirect_uri': 'https://gauthamcity.com/',
      'redirect_uri': 'http://localhost:3000',
      'response_type': 'token',
      'scope': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email',
      'include_granted_scopes': 'true',
      'state': 'pass-through value'
    };
  
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
   // console.log("DONE");
  
    form.submit();
  }

  

// Handles appointment list creation

function addFocusTime()
{
    const topPri = priority.topPriority.items;
    const imp = priority.important.items;
    const othr = priority.other.items;
    const tasks = topPri.concat(imp, othr);
    var apps = oappointmentList.slice(0); // to restore "task duplication bug for testing purposes, change to appointmentList instead of oappointmentList"
    var t = 0;
    var slot = 0;
    
    for (var i = 6; i < 20; i++)
    {
        if (apps[i] && tasks[t])
        {                                //Total Pomo time                      Total Short Break Time                         Total Long Break Time
            const dur = Math.ceil(((tasks[t].pomTimers * taskTime) + (tasks[t].pomTimers * shortTime) + (Math.floor(tasks[t].pomTimers / 4) * longTime)) /60);
        
            if(!apps[i].name && t < tasks.length)
            {
                apps[i] = {
                    type: "task",
                    name: tasks[t].title,
                    start: parseInt(apps[i-1].end),
                    end: parseInt(apps[i-1].end) + 1, // temp, implies task takes 1 hour
                    timers: { done: tasks[t].usedTimers, total: tasks[t].pomTimers }
                };
                slot++;
            }
            if(slot === parseInt(dur))
            {
                t++;
                slot = 0;
            }
        }
        
    }
    setAppointmentList(apps);

}

function findAppt()
{
    var found = false;
    var arr = [];
    var allArr = [];

    nonRecurringEvents.forEach( (event) => {
        if (event.start.date)
        {
            allArr.push(event);
        }
    });
    for(let x = 0; x < 24; x++){
        nonRecurringEvents.forEach( (event) => {
            var evtHr;
            if(event.start && event.start.dateTime)
            {
                evtHr = event.start.dateTime;
                evtHr = evtHr.slice(evtHr.search('T')+1, evtHr.search(':'));
            }
            if(parseInt(evtHr) === parseInt(x))
            {
                arr.push({type: "appt",
                          time: x, 
                          name: event.summary, 
                          start: (event.start.dateTime).slice(event.start.dateTime.search('T')+1, event.start.dateTime.search(':')), // converts start dateTime to hour string
                          end: (event.end.dateTime).slice(event.end.dateTime.search('T')+1, event.end.dateTime.search(':')), //converts end dateTime to hour string
                          desc: event.description,
                          timers: null});
                found = true;
                var evtEndHr = event.end.dateTime;
                evtEndHr = evtEndHr.slice(evtEndHr.search('T')+1, evtEndHr.search(':'));
            }
            if(evtEndHr-evtHr > 1)
            {
                for(var i=1; i < evtEndHr-evtHr; i++)
                {
                    x++;
                }
            }
        });
        if(!found)
        {
            arr.push({time: x, name: null});
        }
        found = false;
    }

    setAppointmentList(arr);
    setoAppointmentList(arr);
    setAllDayAppts(allArr);
}

function handlePlanDay()
{
    //TODO make sure list is populated before scheduling tasks
    if (planDay === false)
    {
        getUserTasksPreviousDay(user);
    }
    addFocusTime();
    setPlanDay(true);
    localStorage.setItem(`${day}-${month}-${year}plan`, JSON.stringify(true));
}

const getUserTasksPreviousDay = async (user) =>
{
    let listOfTasks = [];

    if (!user) {
        return;
    }
    const userTasksPreviousDay = await axios.get("/api/getTaskPreviousDay", {
        params: {
            email: user.email,
            day: day - 1,
            month: month,
            year: year,
            status: 0, // Only fetch tasks with status 0, 1, or 2
        }
    });

    if (userTasksPreviousDay && userTasksPreviousDay.data && Array.isArray(userTasksPreviousDay.data))
    {
        listOfTasks.push(...userTasksPreviousDay.data);
    }

    const userTasksPreviousDay2 = await axios.get("/api/getTaskPreviousDay", {
        params: {
            email: user.email,
            day: day - 1,
            month: month,
            year: year,
            status: 1, // Only fetch tasks with status 0, 1, or 2
        }
    });

    if (userTasksPreviousDay2 && userTasksPreviousDay2.data && Array.isArray(userTasksPreviousDay2.data))
    {
        listOfTasks.push(...userTasksPreviousDay2.data);
    }

    const userTasksPreviousDay3 = await axios.get("/api/getTaskPreviousDay", {
        params: {
            email: user.email,
            day: day - 1,
            month: month,
            year: year,
            status: 3, // Only fetch tasks with status 0, 1, or 2
        }
    });

    if (userTasksPreviousDay3 && userTasksPreviousDay3.data && Array.isArray(userTasksPreviousDay3.data))
    {
        listOfTasks.push(...userTasksPreviousDay3.data);
    }

    for (let i = 0; i < listOfTasks.length; i++)
    {
        const response = await axios.put("/api/updateTaskStatus", {
            params: {
                key: getUserTaskData.length + 1,
                title: listOfTasks[i].taskTitle,
                email: user.email,
                day: listOfTasks[i].day,
                month: listOfTasks[i].month,
                year: listOfTasks[i].year,
                status:3
            }
        });
        if (response) 
        {
            console.log("HERE IS THE RESPONSE DATA" , response.data)
        }
    }

    //change the day of the tasks to the current day
    for (let i = 0; i < listOfTasks.length; i++)
    {
        listOfTasks[i].day = day;
    }

    //insert the tasks into the database with the current day

    let key = getUserTaskData.length + 1;
    for (let i = 0; i < listOfTasks.length; i++)
    {
        const response = await axios.post("/api/insertTask", {
            params: 
            {
                key: key,
                email: user.email,
                title: listOfTasks[i].taskTitle,
                type: listOfTasks[i].type,
                completed: false,
                taskNote: listOfTasks[i].taskNote,
                pomodoroCount: listOfTasks[i].pomodoroCount,
                note: listOfTasks[i].note,
                day: listOfTasks[i].day,
                month: listOfTasks[i].month,
                year: listOfTasks[i].year,
                status: 0,
                usedTimers: listOfTasks[i].usedTimers,
            } 
        });
        //Only sets the data if there is a result
        if(response){ 
            //console.log(response)
            setInsertTaskData(response.data);
        }
        key++;
    }
    getUserTasks(user);
    return;
}


useEffect(()=> {
    findAppt();
}, [nonRecurringEvents]);

const pomoRef = useRef();

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
                paddingBottom: "5vh",            
                }}
                display="flex"
                flexDirection="column"
                >
                <div className="container-fluid">
                    <Typography sx ={{mt: 3, mb: 4}} variant="h4">Crush It</Typography>
                    <Divider variant="middle" color="#3E3F42" sx={{ height: 2, width: '160px' }} />
                    <Box textAlign={"center"} sx={{padding: "10px"}} >
                        <img src={WebIcon} width={148} height={148} alt="WebIcon" />
                    </Box>

                    <Box textAlign={"center"}>
                        <Typography textAlign={"center"} variant={"h5"}>{`It’s time to plan your day!`}</Typography>
                        {isThisCurrent(selectedDate) && (
                            <Button 
                            sx={{ mt: 5, mb: 2, borderRadius: 3, width: 150, height: 50, border: "2px solid" }} 
                            color="white" 
                            variant="outlined"
                            onClick={handlePlanDay}
                            >
                            Plan Day
                            </Button>
                        )} 
                    </Box>
                </div>
                <Box sx={{flexGrow: 1}}/>
                <Box>
                    <Button onClick={() => (window.location.href = "/AuthDetails")} sx={{ height: "45px", borderRadius: 3, border: "1px solid"}} color="white" variant="outlined"><LogoutOutlinedIcon sx={{width: 20, height: 20, mr: 1}}/>Log Out</Button>
                </Box>
            </Box>
        </Grid>
            <AppBar elevation={12} color="white" sx={{width: `calc(100% - ${200}px)`}}>   
                <Toolbar>
                    <Typography sx={{fontWeight: "bold"}}variant="h4">Tasks</Typography>
                    <Box sx={{flexGrow: 1}}></Box>
                    <Button sx={{textTransform: "none"}} onClick={handleClick}><Avatar sx={{bgcolor: "#6284FF26"}}><PermIdentityRoundedIcon sx={{color: "#6284FF"}} /></Avatar><Typography sx={{fontWeight: "bold", color: theme ? "#fff" : "black", ml: 1}}>{data?.firstName} {data?.lastName}</Typography></Button>
                    <Menu
                        id="profile-menu"
                        anchorEl={anchorEl2}
                        open={open2}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => (window.location.href = "/Profile")}>Profile</MenuItem>
                        <MenuItem onClick={() => (window.location.href = "/")}>Tasks</MenuItem>
                        <MenuItem onClick={() => (window.location.href = "/AuthDetails")}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>                 
                    <Grid item xs={10}>
                        {/* Date Navbar */}
                        <Box 
                            sx={{mt: 12, width: "100%", bgcolor: "#6284FF26", borderRadius: 3,}}
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
                                    MenuProps={{
                                    anchorOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    },
                                    PaperProps: { sx: { maxHeight: 200, border: 1, borderColor: "#6284FF", borderRadius: 3} }
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
                                    MenuProps={{
                                        anchorOrigin: {
                                            vertical: "top",
                                            horizontal: "left"
                                        },
                                        transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left"
                                        },
                                        PaperProps: { sx: { maxHeight: 200, border: 1, borderColor: "#6284FF", borderRadius: 3} }
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
                                    MenuProps={{
                                        anchorOrigin: {
                                          vertical: "top",
                                          horizontal: "left"
                                        },
                                        transformOrigin: {
                                          vertical: "top",
                                          horizontal: "left"
                                        },
                                        PaperProps: { sx: { maxHeight: 200, border: 1, borderColor: "#6284FF", borderRadius: 3} }
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
                            subBox={focusSubBox}
                            ref = {pomoRef}
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
                                        <form onSubmit={handleSubmit}>
                                            <FormControl >
                                                <Box p={2}>
                                                    <Typography sx={{mb:0.5}}>Task Title*</Typography>
                                                    <TextField
                                                        sx={{mb:2}}
                                                        label="Title"
                                                        required
                                                        variant="outlined"
                                                        fullWidth
                                                        value={taskTitle}
                                                        helperText='Task title must be unique'
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
                                                            setNumTimers(parseInt(e.target.value));
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
                                                    <Button type="submit" color="primary">
                                                        Add Task
                                                    </Button>
                                                </Box>
                                            </FormControl>
                                        </form>
                                    </Popover>
                                </Typography>
                                                                                    
                                <Paper sx={{width: "43vw", maxHeight: "70vh", minHeight: "70vh",  borderRadius: "10px", p:2, flexWrap: 'wrap', overflow: 'auto'}} elevation={12}>
                                    <DragDropContext onDragEnd={handleOnDragEnd}>

                                    <Box sx={{display: "flex", flexDirection: "column"}}>

                                        {/* Top Priority Task Box*/}
                                        <Box sx={{ 
                                            ml:2,
                                            width: "95%", 
                                            height: "100%",  
                                            bgcolor: theme ? "#4D4D4D" : "#F5F7F9",
                                            borderRadius: "8px",}}>
                                            <Typography sx={{ml:2,mt:2, mb:1, fontWeight: 700, fontSize:'20px'}}>
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
                                                            <Accordion expanded={subBox.exp} key={subBox.key} sx={{width: "95%", borderRadius: "10px", '&:before': {display: 'none',}, bgcolor: theme ? "#737373" : ""}} elevation={0} TransitionProps={{ unmountOnExit: true }}>

                                                                <AccordionSummary 
                                                                expandIcon={<IconButton onClick={() => dropdownClick(subBox)}><ExpandCircleDownOutlinedIcon sx={{color: theme ? "#fff" : "black"}}  /></IconButton>}
                                                                aria-controls="panel1a-content"
                                                                sx={{ 
                                                                    width: "100%", 
                                                                    height: "3vh",  
                                                                    borderRadius: "8px",
                                                                    paddingLeft: 0,
                                                                    paddingRight: 1,
                                                                }}
                                                                elevation={0}
                                                                >
                                                                <Toolbar disableGutters sx={{width: "100%"}}>
                                                                        <IconButton onClick={() => {
                                                                        //console.log(subBox.currentIcon);
                                                                        subBox.currentIcon=(subBox.currentIcon + 1) % icons.length;
                                                                        setCurrentIcon(subBox.currentIcon);
                                                                        updateUserTasks(user, subBox);
                                                                    }}
                                                                    sx={{color: theme ? "#fff" : "black"}} aria-label="icon">
                                                                            {icons[subBox.currentIcon]}
                                                                        {/* {subBox.currentIcon} */}
                                                                        </IconButton>
                                                                        <Button onClick={() => {handleOpenPomo(subBox.title, subBox.note, subBox.pomTimers, subBox)}} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color: theme ? "#859FFF" : "#6284FF", textTransform: "none", justifyContent: "flex-start"}}>
                                                                            {subBox.title}
                                                                        </Button>
                                                                        <Box sx={{flexGrow: 1}} />
                                                                        <IconButton aria-label="drag" sx={{padding: 0}}>
                                                                            <OpenWithRoundedIcon sx={{ color: theme ? "#fff" : "black" }} />
                                                                        </IconButton> 
                                                                        <Box sx={{ mr: ".3em"}} />                                                                                             
                                                            </Toolbar>
                                                    
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />


                                                                    <Grid container alignItems="center">
                                                                        <Grid item xs>
                                                                            <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color: theme ? "#FFF" : "#1F1F1F"}}>
                                                                                Number of Pomodoro Timers ({taskTime} mins each)
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
                                                                                    if(subBox.pomTimers > 1 && subBox.usedTimers < subBox.pomTimers){
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
                                                                                        setTaskNote(subBox.note);
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
                                                                                    <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color: theme ? "#444444" : "#545454"}}>
                                                                                        Notes
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <IconButton sx={{ml: 2}} aria-label="editNote" 
                                                                                        onClick={() => {
                                                                                        subBox.editNote=!(subBox.editNote);
                                                                                        setEditNote(subBox.editNote);
                                                                                    }}>
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}}  />
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                                <Typography display={"inline"} sx={{fontWeight: 700, fontSize:'14px', color: theme ? "#FFF" : "#1F1F1F"}}>
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
                                            bgcolor: theme ? "#4D4D4D" : "#F5F7F9",
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
                                                            <Accordion expanded={subBox.exp} key={subBox.key} sx={{width: "95%", borderRadius: "10px", '&:before': {display: 'none',}, bgcolor: theme ? "#737373" : ""}} elevation={0} TransitionProps={{ unmountOnExit: true }}>

                                                                <AccordionSummary 
                                                                expandIcon={<IconButton onClick={() => dropdownClick(subBox)}><ExpandCircleDownOutlinedIcon sx={{color: theme ? "#fff" : "black"}}  /></IconButton>}
                                                                aria-controls="panel1a-content"
                                                                sx={{ 
                                                                    width: "100%", 
                                                                    height: "3vh",  
                                                                    borderRadius: "8px",
                                                                    paddingLeft: 0,
                                                                    paddingRight: 1,
                                                                }}
                                                                elevation={0}
                                                                >
                                                                <Toolbar disableGutters sx={{width: "100%"}}>
                                                                        <IconButton onClick={() => {
                                                                        //console.log("Current Icon" , subBox.currentIcon);
                                                                        subBox.currentIcon=(subBox.currentIcon + 1) % icons.length;
                                                                        setCurrentIcon(subBox.currentIcon);
                                                                        updateUserTasks(user, subBox);
                                                                    }}
                                                                    sx={{color: theme ? "#fff" : "black"}} aria-label="icon">
                                                                            {icons[subBox.currentIcon]}
                                                                        {/* {subBox.currentIcon} */}
                                                                        </IconButton>
                                                                        <Button onClick={() => {handleOpenPomo(subBox.title, subBox.note, subBox.pomTimers, subBox)}} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color: theme ? "#859FFF" : "#6284FF", textTransform: "none", justifyContent: "flex-start"}}>
                                                                            {subBox.title}
                                                                        </Button>
                                                                        <Box sx={{flexGrow: 1}} />
                                                                        <IconButton sx={{padding: 0}} aria-label="drag">
                                                                            <OpenWithRoundedIcon sx={{ color: theme ? "#fff" : "black" }} />
                                                                        </IconButton> 
                                                                        <Box sx={{ mr: ".3em"}} />                                                                                             
                                                            </Toolbar>
                                                    
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />


                                                                    <Grid container alignItems="center">
                                                                        <Grid item xs>
                                                                            <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color: theme ? "#FFF" : "#1F1F1F"}}>
                                                                                Number of Pomodoro Timers ({taskTime} mins each)
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
                                                                                    if(subBox.pomTimers > 1  && subBox.usedTimers < subBox.pomTimers){
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
                                                                                    <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color: theme ? "#444444" : "#545454"}}>
                                                                                        Notes
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <IconButton sx={{ml: 2}} aria-label="editNote" onClick={() => {
                                                                                        subBox.editNote=!(subBox.editNote);
                                                                                        setEditNote(subBox.editNote);
                                                                                    }}>
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}}  />
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                                <Typography display={"inline"} sx={{fontWeight: 700, fontSize:'14px', color: theme ? "#FFF" : "#1F1F1F"}}>
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
                                            bgcolor: theme ? "#4D4D4D" : "#F5F7F9",
                                            borderRadius: "8px",}}>
                                            <Typography sx={{ml:2,mt:2, mb:1, fontWeight: 700, fontSize:'20px'}}>
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
                                                            <Accordion expanded={subBox.exp} key={subBox.key} sx={{width: "95%", borderRadius: "10px", '&:before': {display: 'none',}, bgcolor: theme ? "#737373" : ""}} elevation={0} TransitionProps={{ unmountOnExit: true }}>

                                                                <AccordionSummary 
                                                                expandIcon={<IconButton onClick={() => dropdownClick(subBox)}><ExpandCircleDownOutlinedIcon sx={{color: theme ? "#fff" : "black"}}  /></IconButton>}
                                                                aria-controls="panel1a-content"
                                                                sx={{ 
                                                                    width: "100%", 
                                                                    height: "3vh",  
                                                                    borderRadius: "8px",
                                                                    paddingLeft: 0,
                                                                    paddingRight: 1,
                                                                }}
                                                                elevation={0}
                                                                >
                                                                <Toolbar disableGutters sx={{width: "100%"}}>
                                                                        <IconButton onClick={() => {
                                                                        //console.log(subBox.currentIcon);
                                                                        subBox.currentIcon=(subBox.currentIcon + 1) % icons.length;
                                                                        setCurrentIcon(subBox.currentIcon);
                                                                        updateUserTasks(user, subBox);
                                                                    }}
                                                                    sx={{color: 'black'}} aria-label="icon">
                                                                            {icons[subBox.currentIcon]}
                                                                        {/* {subBox.currentIcon} */}
                                                                        </IconButton>
                                                                        <Button onClick={() => {handleOpenPomo(subBox.title, subBox.note, subBox.pomTimers, subBox)}} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color: theme ? "#859FFF" : "#6284FF", textTransform: "none", justifyContent: "flex-start"}}>
                                                                            {subBox.title}
                                                                        </Button>
                                                                        <Box sx={{flexGrow: 1}} />
                                                                        <IconButton sx={{padding: 0}} aria-label="drag">
                                                                            <OpenWithRoundedIcon sx={{ color: theme ? "#fff" : "black"}} />
                                                                        </IconButton> 
                                                                        <Box sx={{ mr: ".3em"}} />                                                                                             
                                                            </Toolbar>
                                                    
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Divider variant="middle" color="#E2EAF1" sx={{ mt:1, height: 2, width: "95%" }} />


                                                                    <Grid container alignItems="center">
                                                                        <Grid item xs>
                                                                            <Typography display={"inline"} sx={{ml: 2, mt:1, fontWeight: 500, fontSize:'16px', color: theme ? "#FFF" : "#1F1F1F"}}>
                                                                                Number of Pomodoro Timers ({taskTime} mins each)
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
                                                                                if(subBox.pomTimers > 1 && subBox.usedTimers < subBox.pomTimers){
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
                                                                                    <Typography sx={{ml:2, mt:1, fontWeight: 500, fontSize:'12px', color: theme ? "#444444" : "#545454"}}>
                                                                                        Notes
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <IconButton sx={{ml: 2}} aria-label="editNote" onClick={() => {
                                                                                        subBox.editNote=!(subBox.editNote);
                                                                                        setEditNote(subBox.editNote);
                                                                                    }}>
                                                                                        <BorderColorOutlinedIcon sx={{color:"#6284FF"}}  />
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Box sx={{ml:2, mt:1,mb:1, width: "85%"}}>
                                                                                <Typography display={"inline"} sx={{fontWeight: 700, fontSize:'14px', color: theme ? "#FFF" : "#1F1F1F"}}>
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
                            <Box sx={{ml:2, width: "100%"}}>
                                <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                                >
                                    <Typography variant="h5" sx={{fontWeight: "bold",mt:3,mb:1, fontSize:'30px'}}>Appointments</Typography>
                                    <Box sx={{flexGrow: 1}}/>                                       
                                    {accessToken ? (<Button variant="contained" size="small" color="purple" sx={{height: "40px", textAlign: "center", borderRadius: 3}} onClick={handleSignOut}>Sign Out</Button>) : (<></>)}
                                </Box>             
                                <Paper sx={{width: "100%", maxHeight: "70vh", minHeight: "70vh", borderRadius: "10px", p:2, flexWrap: 'wrap', paddingLeft: 0, overflow: 'auto'}} elevation={12}>
                                    <Box sx={{display: "flex", flexDirection: "column"}}>
                                        {/* Beginning of Google API data */}
                                        <Grid container className="App">
                                            {accessToken ? (
                                            <>
                                            {allDayappts.length > 0 ? (
                                            <>
                                            <Grid item xs={1.5} sx={{textAlign:"center"}}><Typography>All Day</Typography></Grid>
                                            <Grid item xs={10.5}>
                                                <List>
                                                        {allDayappts.map((appt, index) => (
                                                            <ListItem key={index} sx={{border: 2, borderColor: '#E2EAF1', padding: 0, mt: -.25}}>
                                                                <Accordion sx={{width: "100%", '&:before': {display: 'none',}}} elevation={0} TransitionProps={{ unmountOnExit: true }}>
                                                                    <AccordionSummary 
                                                                        expandIcon={<ExpandCircleDownOutlinedIcon sx={{color: "black"}} />}
                                                                        aria-controls="panel1a-content"
                                                                        sx={{ 
                                                                            width: "100%", 
                                                                            height: "3vh",  
                                                                            borderRadius: "8px",
                                                                            paddingLeft: 0,
                                                                        }}
                                                                        elevation={0}
                                                                    >
                                                                    <Typography sx={{fontWeight: 700, ml: 2}}>{appt.summary}</Typography>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        {appt.start && (
                                                                            <Typography> Start Time: {appt.start.date}</Typography>
                                                                        )}
                                                                        {appt.description && (
                                                                            <Typography>Description: {appt.description}</Typography>
                                                                        )}
                                                                    </AccordionDetails>
                                                                    
                                                                </Accordion>
                                                            </ListItem>
                                                        ))}
                                                </List>
                                            </Grid>
                                            <Grid item xs={12}><Divider sx={{mt: .5, mb: .5}} /></Grid>
                                            </>) : (<></>)}
                                                <Grid item xs={1.5} sx={{textAlign: "center"}}>
                                                    <Stack spacing={3.25} sx={{alignItems: "center"}}>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 0) ? 700 : 400,  border: (currentTime.getHours() === 0) ? 2 : 0, borderColor: (currentTime.getHours() === 0) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 0) ? "#6284FF" : "", width: 55 }}>12 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 1) ? 700 : 400,  border: (currentTime.getHours() === 1) ? 2 : 0, borderColor: (currentTime.getHours() === 1) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 1) ? "#6284FF" : "", width: 55 }}>1 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 2) ? 700 : 400,  border: (currentTime.getHours() === 2) ? 2 : 0, borderColor: (currentTime.getHours() === 2) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 2) ? "#6284FF" : "", width: 55 }}>2 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 3) ? 700 : 400,  border: (currentTime.getHours() === 3) ? 2 : 0, borderColor: (currentTime.getHours() === 3) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 3) ? "#6284FF" : "", width: 55 }}>3 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 4) ? 700 : 400,  border: (currentTime.getHours() === 4) ? 2 : 0, borderColor: (currentTime.getHours() === 4) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 4) ? "#6284FF" : "", width: 55 }}>4 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 5) ? 700 : 400,  border: (currentTime.getHours() === 5) ? 2 : 0, borderColor: (currentTime.getHours() === 5) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 5) ? "#6284FF" : "", width: 55 }}>5 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 6) ? 700 : 400,  border: (currentTime.getHours() === 6) ? 2 : 0, borderColor: (currentTime.getHours() === 6) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 6) ? "#6284FF" : "", width: 55 }}>6 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 7) ? 700 : 400,  border: (currentTime.getHours() === 7) ? 2 : 0, borderColor: (currentTime.getHours() === 7) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 7) ? "#6284FF" : "", width: 55 }}>7 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 8) ? 700 : 400,  border: (currentTime.getHours() === 8) ? 2 : 0, borderColor: (currentTime.getHours() === 8) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 8) ? "#6284FF" : "", width: 55 }}>8 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 9) ? 700 : 400,  border: (currentTime.getHours() === 9) ? 2 : 0, borderColor: (currentTime.getHours() === 9) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 9) ? "#6284FF" : "", width: 55 }}>9 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 10) ? 700 : 400, border: (currentTime.getHours() === 10) ? 2 : 0, borderColor: (currentTime.getHours() === 10) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 10) ? "#6284FF" : "", width: 55 }}>10 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 11) ? 700 : 400, border: (currentTime.getHours() === 11) ? 2 : 0, borderColor: (currentTime.getHours() === 11) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 11) ? "#6284FF" : "", width: 55 }}>11 AM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 12) ? 700 : 400, border: (currentTime.getHours() === 12) ? 2 : 0, borderColor: (currentTime.getHours() === 12) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 12) ? "#6284FF" : "", width: 55 }}>12 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 13) ? 700 : 400, border: (currentTime.getHours() === 13) ? 2 : 0, borderColor: (currentTime.getHours() === 13) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 13) ? "#6284FF" : "", width: 55 }}>1 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 14) ? 700 : 400, border: (currentTime.getHours() === 14) ? 2 : 0, borderColor: (currentTime.getHours() === 14) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 14) ? "#6284FF" : "", width: 55 }}>2 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 15) ? 700 : 400, border: (currentTime.getHours() === 15) ? 2 : 0, borderColor: (currentTime.getHours() === 15) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 15) ? "#6284FF" : "", width: 55 }}>3 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 16) ? 700 : 400, border: (currentTime.getHours() === 16) ? 2 : 0, borderColor: (currentTime.getHours() === 16) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 16) ? "#6284FF" : "", width: 55 }}>4 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 17) ? 700 : 400, border: (currentTime.getHours() === 17) ? 2 : 0, borderColor: (currentTime.getHours() === 17) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 17) ? "#6284FF" : "", width: 55 }}>5 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 18) ? 700 : 400, border: (currentTime.getHours() === 18) ? 2 : 0, borderColor: (currentTime.getHours() === 18) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 18) ? "#6284FF" : "", width: 55 }}>6 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 19) ? 700 : 400, border: (currentTime.getHours() === 19) ? 2 : 0, borderColor: (currentTime.getHours() === 19) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 19) ? "#6284FF" : "", width: 55 }}>7 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 20) ? 700 : 400, border: (currentTime.getHours() === 20) ? 2 : 0, borderColor: (currentTime.getHours() === 20) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 20) ? "#6284FF" : "", width: 55 }}>8 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 21) ? 700 : 400, border: (currentTime.getHours() === 21) ? 2 : 0, borderColor: (currentTime.getHours() === 21) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 21) ? "#6284FF" : "", width: 55 }}>9 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 22) ? 700 : 400, border: (currentTime.getHours() === 22) ? 2 : 0, borderColor: (currentTime.getHours() === 22) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 22) ? "#6284FF" : "", width: 55 }}>10 PM</Typography>
                                                        <Typography sx={{ fontWeight: (currentTime.getHours() === 23) ? 700 : 400, border: (currentTime.getHours() === 23) ? 2 : 0, borderColor: (currentTime.getHours() === 23) ? "#6284FF" : "#FFF", borderRadius: 2, color: (currentTime.getHours() === 23) ? "#6284FF" : "", width: 55 }}>11 PM</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={10.5}>
                                                    {/* Display Non-Recurring Events */}
                                                    <List sx={{width: "100%", mt: 1.5, padding: 0}}>
                                                    {appointmentList.map((pair, index) => (
                                                        pair.name ? ( // check if task exists
                                                            pair.type === "appt" ? (
                                                            // Appointment box config
                                                            <ListItem key={index} sx={{border: 2, borderColor: '#E2EAF1', padding: 0, mt: -.25}}>
                                                                <Box sx={{width: "100%", height: (48 * (parseInt(pair.end) - parseInt(pair.start)))}} display = "flex" alignItems="center">
                                                                    <Typography sx={{fontWeight: 700, ml: 2}}>{pair.name}</Typography>
                                                                </Box>
                                                            </ListItem>
                                                            ) : (
                                                                // Task box config
                                                                <ListItem key={index} sx={{border: 2, borderColor: (pair.end <= currentTime.getHours()) ? '#E2EAF1' : '#6284FF', backgroundColor: (pair.end === currentTime.getHours() + 1) ? '#6284FF14' : '', padding: 0, mt: -.25}}>
                                                                <Box sx={{width: "100%", height: 48}} display = "flex" alignItems="center">
                                                                    <Box
                                                                        display="flex"
                                                                        flexDirection="row"
                                                                        sx={{width: "100%"}}
                                                                    >
                                                                        <Typography sx={{fontWeight: 700, ml: 2}}>Focus Time <CircleIcon sx={{color: (pair.end <= currentTime.getHours()) ? '#E2EAF1' : '#6284FF', height: 10, width: 10, ml: 1}}/> {pair.name}</Typography>
                                                                        <Box sx={{flexGrow: 1}} />
                                                                        <HourglassEmptyIcon sx={{color: (pair.end <= currentTime.getHours()) ? '#E2EAF1' : '#6284FF', mr: .4}} />
                                                                        <Typography sx={{fontWeight: 700, fontSize: "18px"}}> {pair.timers.done}/{pair.timers.total}</Typography>
                                                                        <Box sx={{flexGrow: .06}} />
                                                                        {/* Show time remaining only if highlighted task*/}
                                                                        {pair.end === currentTime.getHours() + 1 ? (
                                                                        <Box sx={{borderRadius: 2, backgroundColor: '#6284FF1A', height: "29px", width: "50px"}}
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            justifyContent="center"
                                                                        >
                                                                            <Typography sx={{color: '#6284FF'}}>{pomoRef.current.displayTimer()}</Typography>
                                                                        </Box>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                    </Box>
                                                                     <IconButton 
                                                                    onClick={() => {
                                                                        const task = subBoxes.filter( function(subBox){return (subBox.title===(pair.name))});
                                                                        handleOpenPomo(task[0].title, task[0].note, task[0].pomTimers, task[0]);
                                                                    }}
                                                                    ><ExpandCircleDownOutlinedIcon sx={{color: theme ? "#fff" : "black", transform: "rotate(270deg)"}} /></IconButton>
                                                                </Box>
                                                                </ListItem>
                                                            )
                                                        ) : (
                                                            <ListItem key={index} sx={{ padding: 0}}>
                                                                <Box sx={{width: "100%", height: 50}}></Box>
                                                            </ListItem>
                                                        )
                                                    ))}
                                                    </List>
                                                </Grid>
                                            </>
                                            ) : (
                                            <>
                                                <Box
                                                    sx={{ml:2,
                                                        width: "100%", 
                                                        minHeight: "66.7vh",  
                                                        bgcolor: theme ? "#4D4D4D" : "#F5F7F9",
                                                        borderRadius: "8px",
                                                    }}
                                                    display = "flex"
                                                    alignItems="center"
                                                    flexDirection="row"
                                                    justifyContent="center"
                                                >
                                                    <Button variant="contained" size="large" color="purple" sx={{borderRadius: 3}} onClick={oauthSignIn}>Sign In with Google</Button>
                                                </Box>
                                            </>
                                            )}
                                        {/*<div id="error-message" style={{ color: 'red', fontWeight: 'bold' }}>
                                            {errorMessage}
                                            </div> */}
                                        </Grid>
                                        {/* End of Google API data */}
                                    </Box>
                                </Paper>
                            </Box>   
                        </Box>
                    </Grid>
                </Grid>
        </CssBaseline>
    );
}

export default Home;