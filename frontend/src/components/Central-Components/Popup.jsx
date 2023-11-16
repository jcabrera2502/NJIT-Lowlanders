import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { Typography, Button } from "@mui/material";

export function PomoPopup(props) {
    const { onPomoClose, pomoOpen, taskTitle, taskTime, shortTime, longTime } = props;
    const handlePomoClose = () => {
        //console.log("closed");
        onPomoClose();
    };
    return (
        <Dialog onClose={handlePomoClose} open={pomoOpen}>
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
            <Button variant="contained">
                Start
            </Button>
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