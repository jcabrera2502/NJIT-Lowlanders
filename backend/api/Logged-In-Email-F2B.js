import express, { response } from 'express';
import useHistory from 'react-router-dom';
import mongoose from 'mongoose';
const router = express.Router();



//Gets the user information based off of their email DONE
router.get('/email', async (req, res) =>
{
    console.log(req);
    const collection = mongoose.connection.db.collection("user-profile");
    const result = await collection.findOne({email: req.query.email})
    res.send(result);
   
});

export default router;

