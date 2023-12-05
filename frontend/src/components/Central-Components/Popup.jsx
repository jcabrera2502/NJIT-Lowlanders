import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Typography, Button, Box, Dialog, IconButton, TextField } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import sound from "./Sounds/alarm.mp3"
export function PomoPopup(props) {
    //popup
    const { onPomoClose, pomoOpen, taskTitle, taskDesc, taskTimers, taskTime, shortTime, longTime, subBox } = props;
    const handlePomoClose = () => {
        //console.log("closed");
        if (ticking) {
            toggleTimer();
        }
        resetTimer();
        onPomoClose();
    };

    //alarm audio controller
    function play() {
        new Audio(sound).play();
    }
    

    //tabs
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                  </Box>
                )}
            </div>
        );
    }
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };
    function tabProps(index) {
        return {
            id: `tab-${index}`,
            'aria-controls': `tabpanel-${index}`,
        };
    };
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        if (ticking) {
            toggleTimer();
        }
        resetTimer();
        setTabValue(newValue);
        setTimer('00:' + chooseTime(newValue) + ':00');
    };

    //timer
    const Ref = useRef(null);
    const [timer, setTimer] = useState('00:' + chooseTime(tabValue) + ':00');
    const getRemaining = (t) => {
        //console.log(ticking);
        const total = Date.parse(t) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    };
    const startTimer = (t, tick) => {
        //console.log("start " + tick);
        //console.log(Ref.current);
        if (tick) {
            var { total, hours, minutes, seconds } = getRemaining(t);
            if (total >= 0) {
                setTimer(
                    (hours > 9 ? hours : '0' + hours) + ':' +
                    (minutes > 9 ? minutes : '0' + minutes) + ':' +
                    (seconds > 9 ? seconds : '0' + seconds)
                )
            }
            else {
                play(); //play alarm
                clearInterval(Ref.current);
                setTicking(false);
                if (tabValue == 0) {
                    subBox.usedTimers= ((subBox != null) ? (subBox.usedTimers) : 444);
                    subBox.usedTimers= subBox.usedTimers+1;
                    if (subBox.usedTimers % 4 == 0){
                        // if (subBox.usedTimers != subBox.pomTimers) {
                            resetTimer();
                            setTabValue(2);
                            setTimer('00:' + chooseTime(2) + ':00');
                        // }
                    }
                    else{
                        // if (subBox.usedTimers != subBox.pomTimers) {
                            resetTimer();
                            setTabValue(1);
                            setTimer('00:' + chooseTime(1) + ':00');
                        // }
                    }
                }else{
                    resetTimer();
                    setTabValue(0);
                    setTimer('00:' + chooseTime(0) + ':00');
                }
                console.log("TIMER END");
            }
        }
    };
    const clearTimer = (t, tick) => {
        //console.log("clear " + !tick);
        if (!tick) {
            clearInterval(Ref.current);
        }
        else {
            //setTimer('00:' + chooseTime(tabValue) + ':00');
            if (Ref.current) {
                clearInterval(Ref.current);
            }
            const id = setInterval(() => {
                startTimer(t, tick);
            }, 1000)
            Ref.current = id;
        }  
    };
    const getDeadTime = () => {
        let deadline = new Date();
        //console.log(timer.substring(0,2) + ":" + timer.substring(3,5) + ":" + timer.substring(6,8));
        deadline.setHours(deadline.getHours() + parseInt(timer.substring(0,2)));
        deadline.setMinutes(deadline.getMinutes() + parseInt(timer.substring(3,5)));
        deadline.setSeconds(deadline.getSeconds() + parseInt(timer.substring(6,8)));
        return deadline;
    };
    const resetTimer = () => {
        setTimer('00:' + chooseTime(tabValue) + ':00');
    };
    function chooseTime(tab) {
        if (tab === 0) {
            return (taskTime > 9 ? taskTime : '0' + taskTime);
        }
        if (tab === 1) {
            return (shortTime > 9 ? shortTime : '0' + shortTime);
        }
        if (tab === 2) {
            return (longTime > 9 ? longTime : '0' + longTime);
        }
    };
    function displayTimer() {
        if (taskTime > 59 || shortTime > 59 || longTime > 59) {
            return timer;
        }
        else {
            return timer.substring(3);
        }
    };
    const [ticking, setTicking] = useState(false);
    const toggleTimer = () => {
        if (ticking) {
            setTicking(false);
            clearTimer(getDeadTime(), false);
        }
        else if( subBox.usedTimers <= subBox.pomTimers ) {
        // else {
            if (tabValue === 0 && subBox.usedTimers == subBox.pomTimers) {
                // setTicking(true);
                // //console.log("here " + ticking);
                // clearTimer(getDeadTime(), true);
            }
            else {
                setTicking(true);
                //console.log("here " + ticking);
                clearTimer(getDeadTime(), true);
            }
            
        }
    };

    const [editNote, setEditNote] = useState(true);
    
    function getCurrentMilitaryTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    const militaryTime = getCurrentMilitaryTime();

    // Time when the timer will finish with all pomos and breaks
    function timeOfTimerEnd(militaryTime, fractionOfHours) {
        const [hours, minutes] = militaryTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const newTotalMinutes = totalMinutes + fractionOfHours * 60;
        const newHours = Math.floor(newTotalMinutes / 60) % 24;
        const newMinutes = Math.floor(newTotalMinutes) % 60;
        const result = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
        return result;
    }

    const timerEnd= timeOfTimerEnd(militaryTime, (subBox != null) ? (Math.round(((((subBox.pomTimers - subBox.usedTimers) * taskTime) + 
                                                                    (((subBox.pomTimers - subBox.usedTimers)-Math.floor((subBox.pomTimers - subBox.usedTimers)/4))* shortTime) + 
                                                                    (Math.floor((subBox.pomTimers - subBox.usedTimers)/4)*longTime)) /60) *100) /100) : 444 );
    //display
    return (
        <Dialog 
            onClose={handlePomoClose} 
            open={pomoOpen}  
            minWidth={"sm"}
            fullWidth
            minHeigt={"sm"}
            borderRadius={2}
        >
            <Box>
                <Box>
                    <Box sx={{padding: "1em"}}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab sx={{fontWeight: 700, color: "black"}} label="Pomodoro" {...tabProps(0)} />
                            <Tab sx={{fontWeight: 700, color: "black"}} label="Short Break" {...tabProps(1)} />
                            <Tab sx={{fontWeight: 700, color: "black"}} label="Long Break" {...tabProps(2)} />
                        </Tabs>
                    </Box>
                    {/*
                    <TabPanel value={tabValue} index={0}>
                        po
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        sh
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        lo
                    </TabPanel>
                    */}
                </Box>

                <Box
                display="flex"
                flexDirection="column"
                sx={{ bgcolor: "#F5F7F9", mr: "1.5em", ml: "1.5em", mt: ".6em", borderRadius: 2}}
                textAlign={"center"}
                alignItems={"center"}
                >
                    <Typography variant="h1" display={"inline"} sx={{flexGrow: 1, mt: ".3em"}}>
                        {displayTimer()}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={toggleTimer}
                        sx={{minWidth: '9em', minHeight: "3.5em", borderRadius: 3.5, mt: "1.5em", mb: "1.7em", fontFamily: "DM Sans"}}
                        //color="purple"
                    >
                        {(ticking ? "STOP" : "START")}
                    </Button>
                </Box>

                {/* Title Box */}
                <Box sx={{ml: "1.5em", mt: "1em", mb: "1em"}}>
                    <Typography display={"inline"} sx={{ fontWeight: 700, fontSize:'20px', color:"black", flexGrow: 1}}>
                        {taskTitle}
                    </Typography>
                </Box>
                
                {/* Notes Box */}
                <Box sx={{ bgcolor: "#F5F7F9", mr: "1.5em", ml: "1.5em", mt: ".6em", borderRadius: 2, padding: "1em"}}>
                    <Box>
                        {editNote ? (
                        <>
                            <Box display="flex" sx={{mb: ".6em"}}>
                                <Typography sx={{fontWeight: 700, color:"#6284FF"}}>Notes:</Typography>
                                <Box sx={{flexGrow: 1}}/>
                                <IconButton onClick={() => {setEditNote(!editNote)}}><BorderColorOutlinedIcon sx={{color:"#6284FF", height: 20, width: 20}} /></IconButton>
                            </Box>
                            
                                <Typography sx={{fontSize:'16px', flexGrow: 1}}>
                                    {(subBox != null) ? (subBox.note) : (" ")}
                                </Typography>
                        </>
                        ) : (
                        <>
                            <Box display="flex" sx={{mb: ".6em"}}>
                                <Typography sx={{fontWeight: 700, color:"#6284FF"}}>Notes:</Typography>
                            <Box sx={{flexGrow: 1}}/>
                                <IconButton onClick={() => {setEditNote(!editNote);}}><CheckBoxRoundedIcon sx={{color:"#6284FF", height: 20, width: 20}} /></IconButton>
                            </Box>
                            <TextField
                                variant="outlined"
                                fullWidth
                                defaultValue={subBox.note}
                                onChange={(e) => {
                                    subBox.note = e.target.value;
                                    //updateUserTasks(user, subBox);
                                }}
                                multiline
                            />
                        </>
                        )}
                        
                    </Box>
                </Box>
                {/* Timers box*/}
                <Box 
                    sx={{ bgcolor: "#252628", mr: "1.5em", ml: "1.5em", mt: "1.5em", mb: "1.5em", borderRadius: 2, padding: "1em"}}
                    display="flex"
                    flexDirection="row"
                    textAlign="center"
                >
                    <Box sx={{flexGrow: .5}} />
                    <Typography display={"inline-block"} sx={{ ml: 1, fontWeight: 700, fontSize:'20px', color:"#FFFFFF"}}>
                            Pomos: 
                    </Typography>
                    <Typography display={"inline-block"} sx={{ ml: 1, fontWeight: 700, fontSize:'20px', color: "#407BFF"}}>
                        {(subBox != null) ? (subBox.usedTimers) : (0)}/{taskTimers}
                    </Typography>
                    <Box sx={{flexGrow: .15}}/>
                    <Typography sx={{ ml: 1, fontWeight: 700, fontSize:'20px', color:"#FFFFFF"}}>
                            Finish At:
                            <Typography display={"inline-block"} sx={{ ml: 1, fontWeight: 700, fontSize:'20px', color: "#407BFF"}}>
                                {timerEnd}  ({(subBox != null) ? (Math.round(((((subBox.pomTimers - subBox.usedTimers) * taskTime) + 
                                                                            (((subBox.pomTimers - subBox.usedTimers)-Math.floor((subBox.pomTimers - subBox.usedTimers)/4))* shortTime ) + 
                                                                            (Math.floor((subBox.pomTimers - subBox.usedTimers)/4)*longTime)) /60) *100) /100) : 444}h)
                            </Typography>
                    </Typography>
                    <Box sx={{flexGrow: .5}}/>
                </Box>
            </Box>
        </Dialog>
    );
}
PomoPopup.propTypes = {
    onPomoClose: PropTypes.func.isRequired,
    pomoOpen: PropTypes.bool.isRequired,
    //taskTitle: PropTypes.string.isRequired,
    taskTime: PropTypes.number.isRequired,
    shortTime: PropTypes.number.isRequired,
    longTime: PropTypes.number.isRequired,
    // usedTimers: PropTypes.number.isRequired,
    subBox: PropTypes.object,
};