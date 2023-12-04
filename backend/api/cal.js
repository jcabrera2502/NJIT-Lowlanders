import express from "express";
import {google} from 'googleapis';
import axios from 'axios';
//const cors = require('cors')
import cors from 'cors';

const app = express();
const port = 3001;
const oAuth2Client = new google.auth.OAuth2(
"150401460223-dpijoj0c3f8qqbref8j00kqqbn460qgf.apps.googleusercontent.com",
"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",
"http://localhost:3001/google/redirect"
);
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
};

const scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];

 app.use(cors(corsOptions));

 app.get('/google-proxy', async (req, res) => {
  try {
    const response = await axios.get('https://accounts.google.com/o/oauth2/v2/auth', {
      params: {
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar',
        response_type: 'code',
        client_id: '150401460223-dpijoj0c3f8qqbref8j00kqqbn460qgf.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3001/google/redirect',
      },
    });

    res.send(response.data);
  } catch (error) {
    console.error('Error proxying Google OAuth redirect:', error.message);
    res.status(500).send({ message: 'Error proxying Google OAuth redirect' });
  }
});


  app.get("/google", (req,res) => {
    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
  });

  const specificDate = new Date('2023-11-04T00:00:00Z');

  app.get('/google/redirect', async (req, res) => {
    try {
      const code = req.query.code;
      //console.log("CODE", code);
  
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
  
      // Create a new calendar instance using the obtained credentials
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  
      // Example: List the next 10 events on the user's primary calendar
      calendar.events.list({
        calendarId: 'primary',
        timeMin: specificDate.toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, response) => {
        if (err) {
          console.error('Error! fetching events:', err);
          return res.status(500).send({ message: 'Error fetching events' });
        }
  
        const events = response.data.items;
        console.log('Events:', events);
        res.send({ message: 'Success', events });
      });
    } catch (error) {
      console.error('Error during OAuth or API request:', error);
      res.status(500).send({ message: 'Error during OAuth or API request' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
