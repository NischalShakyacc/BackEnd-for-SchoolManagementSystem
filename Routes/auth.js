const express = require('express');
//const connectToMongo = require('./db');
const router  = express.Router();
const UserStd = require('../models/Students.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const JWT_SECRET = 'Nischalm@kingTh!s@app'


//Create a user using:Post "api/auth/createuser". Doesnt require Authentication (No login required)
router.post('/createuser',
    [
        body('name',"Enter a Valid Name >3").trim().isLength({min:3}),
        body('username',"Username is wrong").trim().isLength({min:3}),
        body('password','incorrect password').isLength({min:3})
    ]
,async (req,res)=>{
    console.log(req.body);

    /*
    send data to database
    const studentUser = UserStd(req.body);
    // studentUser = studentUser(req.body);
    //studentUser.save();
    res.send("hello");
    */

    // If errors return bad request along with errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
    //Check whether the same username exists already
    let  user = await UserStd.findOne({username: req.body.username});
    if(user){
        return res.status(400).json({error: "Sorry a user with this username already exists"})
    }


    //Encrypting the password (hashing)
    const salt = await bcrypt.genSalt(10);

    const secPassword = await bcrypt.hash(req.body.password,salt);

    //Create a new User
    user = await UserStd.create({
        name: req.body.name,
        username: req.body.username,
        password: secPassword,
    })

    //Fetching token json
    const data = {
        user:{
            id:user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({authToken})

    }  catch(error){
        console.log(error.message);
        res.status(500).send("Some error occured.")
    }
    // .then(user => res.json(user))
    // .catch(err => {console.log(err)
    //     res.json({
    //         error:'Please Enter u unique username',
    //         message : err.message
    //     })
    //     }
    // )
})

module.exports = router