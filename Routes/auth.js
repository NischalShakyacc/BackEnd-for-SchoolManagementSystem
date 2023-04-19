const express = require('express');
//const connectToMongo = require('./db');
const router  = express.Router();
const UserStd = require('../models/Students.js')


//Create a user using:Post "api/auth/". Doesnt require Authentication
router.post('/',(req,res)=>{
    console.log(req.body);
    const studentUser = UserStd(req.body);
    // studentUser = studentUser(req.body);
    studentUser.save();
    res.send("hello");
})

module.exports = router