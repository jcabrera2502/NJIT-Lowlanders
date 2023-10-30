import React from "react";
import { Button, Typography, Stack, CssBaseline, Box, Grid, 
         Select, MenuItem, FormControl, Slider} from "@mui/material";
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';



function Settings() {
    return (
        <CssBaseline>
            <Grid container spacing={2} sx={{margin: "110px"}}>
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
                        <Select labelId="langId"> 
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
                <Grid item xs={12}>
                    <Typography variant="h5">Delete Account</Typography>
                    <Button color="error" sx={{ mt: 2, mb: 2 }} variant="outlined" type="button"> Delete Account</Button>
                </Grid>
            </Grid>
        </CssBaseline>
    );
}

export default Settings;