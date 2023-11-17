import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { Typography, Button, Box } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export function PomoPopup(props) {
    //popup
    const { onPomoClose, pomoOpen, taskTitle, taskTime, shortTime, longTime } = props;
    const handlePomoClose = () => {
        //console.log("closed");
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
    }
    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog onClose={handlePomoClose} open={pomoOpen}>
            <Box>
                <Box>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Pomodoro" {...tabProps(0)} />
                        <Tab label="Short Break" {...tabProps(1)} />
                        <Tab label="Long Break" {...tabProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    po
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    sh
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    lo
                </TabPanel>
            </Box>
            <Button variant="contained">
                Start
            </Button>
            <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                {taskTitle}
            </Typography>
            <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                {taskTime}
            </Typography>
            <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                {shortTime}
            </Typography>
            <Typography display={"inline"} sx={{ ml: 1, fontWeight: 700, fontSize:'16px', color:"#6284FF", flexGrow: 1}}>
                {longTime}
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