import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Typography, Button, Box, Dialog, IconButton } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
export function PomoPopup(props) {
    //popup
    const { onPomoClose, pomoOpen, taskTitle, taskDesc, taskTimers, taskTime, shortTime, longTime, usedTimers } = props;
    const handlePomoClose = () => {
        //console.log("closed");
        if (ticking) {
            toggleTimer();
        }
        resetTimer();
        onPomoClose();
    };

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
    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setTimer('00:' + chooseTime(newValue) + ':00');
    };

    //timer
    const Ref = useRef(null);
    const [timer, setTimer] = React.useState('00:' + chooseTime(tabValue) + ':00');
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
                clearInterval(Ref.current);
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
        if (tab == 0) {
            return (taskTime > 9 ? taskTime : '0' + taskTime);
        }
        if (tab == 1) {
            return (shortTime > 9 ? shortTime : '0' + shortTime);
        }
        if (tab == 2) {
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
    const [ticking, setTicking] = React.useState(false);
    const toggleTimer = () => {
        if (ticking) {
            setTicking(false);
            clearTimer(getDeadTime(), false);
        }
        else {
            setTicking(true);
            //console.log("here " + ticking);
            clearTimer(getDeadTime(), true);
        }
    };

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
                        color="purple"
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
                        <Box display="flex" sx={{mb: ".6em"}}>
                            <Typography sx={{fontWeight: 700, color:"#6284FF"}}>Notes:</Typography>
                            <Box sx={{flexGrow: 1}}/>
                            <IconButton><BorderColorOutlinedIcon sx={{color:"#6284FF", height: 20, width: 20}} /></IconButton>
                        </Box>
                        <Typography sx={{fontSize:'16px', flexGrow: 1}}>
                            {taskDesc}
                        </Typography>
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
                            {usedTimers}/{taskTimers}
                    </Typography>
                    <Box sx={{flexGrow: .15}}/>
                    <Typography sx={{ ml: 1, fontWeight: 700, fontSize:'20px', color:"#FFFFFF"}}>
                            Finish At: 
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
    usedTimers: PropTypes.number.isRequired,
};