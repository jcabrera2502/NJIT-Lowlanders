import React from "react";
import { Button, Typography, Stack, CssBaseline, Box, Grid,
         Select, MenuItem, FormControl, Slider} from "@mui/material";
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";


function Settings() {
    const [color, setColor] = useColor("#561ecb");

    const [language, setLanguage] = React.useState('');

    const handleChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
            <div>
                <h2>Date Format: </h2>
                <select> 
                    <option value="MonthDayYear">MM/DD/YYYY</option>
                    <option value="DayMonthYear">DD/MM/YYYY</option>
                </select>
            </div>
            <div>
                <h2>Time: </h2>
                <select>
                    <option value="EST">Eastern Standard Time</option>
                    <option value="CST">Central Standard Time</option>
                    <option value="PST">Pacific Standard Time</option>
                </select>
                <select>
                    <option value="Twelve">12-hour</option>
                    <option value="TwentyFour">24-hour</option>
                </select>
            </div>
        <CssBaseline>
            <Grid container spacing={2} sx={{mt: "110px", ml: 2, width: "99%"}}>
                <Grid item xs={12}>
                    <Typography variant="h3">Settings</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Account</Typography>
                    <Box>
                        <Button variant="outlined" sx={{ mt: 1, mb: 2 }} type="button"> Change Username</Button>
                    </Box>
                    <Box>
                        <Button variant="outlined" sx={{ mt: 1, mb: 2 }} type="button"> Change Password</Button>
                    </Box>
                    <Box>
                        <Button variant="outlined" sx={{ mt: 1, mb: 2 }} type="button"> Change Email</Button>
                    </Box>
                    <Box>
                        <Button variant="outlined" sx={{ mt: 1, mb: 2 }} type="button"> Change Phone Number</Button>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Notifications</Typography>
                    <Button variant="outlined" sx={{ mt: 2, mb: 2 }} type="button"> Turn on notifications</Button>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="h5">Language: </Typography>
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <Select labelId="langId" value={language} onChange={handleChange}> 
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="Spanish">Spanish</MenuItem>
                            <MenuItem value="French">French</MenuItem>
                            <MenuItem value="German">German</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Adjust Volume: </Typography>
                    <Stack spacing={2} direction="row" sx={{ mt: 2, mb: 1 }} alignItems="center">
                        <VolumeDown />
                        <Slider sx={{width: 200, margin: 1}}aria-label="Volume"/>
                        <VolumeUp />
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Theme: </Typography>
                    <Button sx={{ mt: 2, mb: 2 }} variant="outlined"> Dark Theme </Button>
                    <Button sx={{ mt: 2, mb: 2, ml: 1 }} variant="outlined"> Light Theme </Button>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{height:320, width:250}}>
                    <ColorPicker
                        color={color} 
                        onChange={setColor}
                        hideInput={["rgb", "hsv"]}
                        hideAlpha
                    />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        <Button type="button" sx={{mb: 2, ml: 1 }} variant="outlined">Primary </Button> 
                        <Button sx={{mb: 2, ml: 4 }} variant="outlined"> Secondary </Button>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Delete Account</Typography>
                    <Button color="error" sx={{ mt: 2, mb: 2 }} variant="outlined" type="button"> Delete Account</Button>
                </Grid>
            </Grid>
        </CssBaseline>
    );
}

export default Settings;