import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import LoggedInUSerSettings from './api/Logged-In-Email-F2B.js';
import SettingsFromEmail from './api/Settings-From-Email.js';
import cors from 'cors';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', LoggedInUSerSettings);
app.use('/', SettingsFromEmail);
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://njit:lowlanders@cs490.utqtnbc.mongodb.net/cs490-project")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;