import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Typography, CssBaseline, Box} from "@mui/material";

function TasksAppts () {
    return(
        <section>
            <div class="container-fluid">
                <h1 class="mt-5">Welcome</h1>
                <p>This site is was created using node js and React</p>
            </div>
        </section>
    );
}
export default TasksAppts;