import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Typography, Button, Box, Dialog } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export function PomoPopup(props) {
    //popup
    const { onPomoClose, pomoOpen, taskTitle, taskDesc, taskTimers, taskTime, shortTime, longTime } = props;
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
        >
            <Box sx={{height: ""}}>
                <Box>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Pomodoro" {...tabProps(0)} />
                        <Tab label="Short Break" {...tabProps(1)} />
                        <Tab label="Long Break" {...tabProps(2)} />
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
             sx={{ bgcolor: "#F5F7F9"}}
            >
                <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                    {displayTimer()}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={toggleTimer}
                    sx={{}}
                >
                    {(ticking ? "STOP" : "START")}
                </Button>
            </Box>
            <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                title {taskTitle}
            </Typography>
            <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                desc {taskDesc}
            </Typography>
            <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                timers {taskTimers}
            </Typography>
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
};