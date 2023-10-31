import express, { response } from 'express';
import useHistory from 'react-router-dom';
import mongoose from 'mongoose';
const router = express.Router();



//Gets the user information based off of their email DONE
router.get('/settings', async (req, res) =>
{
    console.log(req);
    const collection = mongoose.connection.db.collection("user-settings");
    const result = await collection.findOne({email: req.query.email})
    res.send(result);
   
});

export default router;

