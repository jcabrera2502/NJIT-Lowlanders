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
  
export default router;

