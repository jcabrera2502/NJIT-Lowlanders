import express, { response } from 'express';
import mongoose from 'mongoose';
const router = express.Router();



//Gets the user information based off of their email DONE
router.post('/updateSettings', async (req, res) =>
{
    const collection = mongoose.connection.db.collection("user-settings");
    const result = await collection.updateOne({email: req.body.email}, 
        {$set: {primary: req.body.primary, secondary: req.body.secondary,theme: req.body.theme,language: req.body.language}});
    res.send(result);

});

export default router;
