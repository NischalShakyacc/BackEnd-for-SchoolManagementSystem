const express = require('express');
//const connectToMongo = require('./db');
const router  = express.Router();
const UserStd = require('../models/Students');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
var fetchuser = require("../middleware/fetchuser.js")


const JWT_SECRET = 'Nischalm@kingTh!s@app'

/*
-----------------
Start of ROUTE 1 : SIGN UP

Create a user using:Post "api/auth/createuser". 
Doesnt require Authentication (No login required)
-------------------
*/

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
        res.status(500).send("Internal Server error occured.")
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

/*
-----------------
END of ROUTE 1 : SIGN UP
-------------------
*/



/*
-----------------
START of ROUTE 2 : LOG IN
Authenticate a user using: POST '/api/auth/login'. 
*No login required
-------------------
*/


router.post('/login',[
    body('username', 'Not a valid username').isLength({min: 5}),
    body('password', 'Password cannot be empty.').exists(),
],async (req, res) =>{
    //Checking for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {username, password} = req.body;
    try {
        let user = await UserStd.findOne({username});
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials."})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct credentials."})
        }
       //Fetching token json
        const payload = {
            user:{
                id:user.id
            }
        }
        //digital signature using
        const authToken = jwt.sign(payload, JWT_SECRET);
        res.json({authToken})


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occured.")
    }
})


/*
-----------------
END of ROUTE 2 : lOG IN
-------------------
*/


/*
-----------------
Start of ROUTE 3 : Get logged in user details
Get a user's details: POST '/api/auth/getuser'. 
* required user to be logged in
-------------------
*/

router.post('/getuser', fetchuser, async (req, res) =>{
    

    try {
        const userId = req.user.id;
        const user = await UserStd.findById(userId).select('-password');
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occured.")
    }
})


module.exports = router