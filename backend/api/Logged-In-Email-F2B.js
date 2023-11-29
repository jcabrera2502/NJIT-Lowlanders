import express, { response } from 'express';
import useHistory from 'react-router-dom';
import mongoose from 'mongoose';
const router = express.Router();



//Gets the user information based off of their email DONE
router.get('/api/email', async (req, res) =>
{
    console.log(req);
    const collection = mongoose.connection.db.collection("user-profile");
    const result = await collection.findOne({email: req.query.email})
    res.send(result);
   
});
router.post('/api/new', async (req, res) => {
    try {
      const coll = mongoose.connection.db.collection("user-profile");
      const existingUser = await coll.findOne({ email: req.body.email });
  
      if (existingUser) {
        // If the user already exists
        res.json({ message: 'User with this email already exists' });
      } else {
        // User doesn't exist, proceed with insertion
        const result = await coll.insertOne({ email: req.body.email });
        //if an insertion was made
        if (result.insertedCount === 1) {
          res.json({ message: 'Data inserted successfully' });
        } else {
          res.status(500).json({ error: 'Failed to insert data' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.put('/api/updateProfile', async (req, res) =>
{
    const collection = mongoose.connection.db.collection("user-profile");
    console.log("Req" , req.body.params)
    const result = await collection.updateOne({email: req.body.params.email}, {$set: {firstName: req.body.params.firstName, lastName: req.body.params.lastName, pomodoro:req.body.params.pomodoro, shortBreak:req.body.params.shortBreak, longBreak:req.body.params.longBreak}})
    res.send(result);
   
});

router.post('/api/insertTask', async (req, res) =>
{
    const collection = mongoose.connection.db.collection("user-tasks");
    console.log("Req" , req.body.params)

    const result = await collection.insertOne({email: req.body.params.email,
                                               taskTitle: req.body.params.title,
                                               type: req.body.params.type, 
                                               completed: req.body.params.completed, 
                                               pomodoroCount: req.body.params.pomodoroCount, 
                                               note: req.body.params.note, 
                                               date: req.body.params.date,
                                               status: req.body.params.status,
                                               day:req.body.params.day,
                                               month:req.body.params.month,
                                               year:req.body.params.year})
    res.send(result);
   
});

router.get('/api/getTasks', async (req, res) =>
{
    const collection = mongoose.connection.db.collection("user-tasks");
    const day = parseInt(req.query.day);
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const result = await collection.find({email: req.query.email, day: day, month: month, year: year}).toArray();
    res.send(result);
});

router.put('/api/updateTask', async (req, res) =>
{
    const collection = mongoose.connection.db.collection("user-tasks");
    console.log("Req" , req.body.params)
    const result = await collection.updateOne({email: req.body.params.email, 
                                              taskTitle: req.body.params.title, 
                                              day: req.body.params.day, 
                                              month: req.body.params.month,
                                              year: req.body.params.year},
                                              {$set: {note: req.body.params.note,
                                                      pomodoroCount: req.body.params.pomodoroCount,
                                                      status: req.body.params.status,
                                                      type: req.body.params.type}})
    res.send(result);
});
  
export default router;
