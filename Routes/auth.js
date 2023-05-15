const express = require('express');
//const connectToMongo = require('./db');
const router  = express.Router();
const UserAdmin = require('../models/Admins');
const UserStudent = require('../models/Students')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
var fetchuser = require("../middleware/fetchuser.js")
var isAdmin = require("../middleware/isAdmin")


const JWT_SECRET = 'Nischalm@kingTh!s@app'

/*
-----------------
Start of ROUTE 1 : SIGN UP

Create a user using:Post "api/auth/createuser". 
Doesnt require Authentication (No login required)
-------------------
*/

//Only admin can do
router.post('/createuser',fetchuser, isAdmin,
    [
        body('username',"Invalid Username.").trim().isLength({min:3}),
        body('password','Bad password').isLength({min:3}),
        body('name',"Name must be longer").trim().isLength({min:3}),
        body('usertype',"Cannot be empty.").trim().isLength({min:0})
    ]
,async (req,res)=>{
    let success = false;

    /*
    send data to database
    const studentUser = UserAdmin(req.body);
    // studentUser = studentUser(req.body);
    //studentUser.save();
    res.send("hello");
    */

    // If errors return bad request along with errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        success = false;
        return res.status(400).json({success,errors: errors.array()});
    }

    try{
        //Check if adding admin or student
        if(req.body.usertype === "Admin"){
        //Check whether the same username exists already
            let  user = await UserAdmin.findOne({
                username: req.body.username
                });
            if(user){
                success = false;
                return res.status(400).json({success,error: "Sorry a user with this username already exists"})
            }

            //Encrypting the password (hashing)
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password,salt);

            //Create a new User
            user = await UserAdmin.create({
                usertype: req.body.usertype,
                username: req.body.username,
                password: secPassword,
                name: req.body.name,
                dob: req.body.dob,
                address: req.body.address,
                grade: req.body.grade,
                gender: req.body.gender,
                phone: req.body.phone
            })

            //Fetching token json
            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            success=true;
            res.json({success,authToken})
        }else if(req.body.usertype === "Student"){
            //Check whether the same username exists already
            let  user = await UserStudent.findOne({
                username: req.body.username
                });
            if(user){
                success = false;
                return res.status(400).json({success,error: "Sorry a user with this username already exists"})
            }

            //Encrypting the password (hashing)
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password,salt);

            //Create a new User
            user = await UserStudent.create({
                usertype: req.body.usertype,
                username: req.body.username,
                password: secPassword,
                name: req.body.name,
                dob: req.body.dob,
                address: req.body.address,
                grade: req.body.grade,
                gender: req.body.gender,
                phone: req.body.phone,
                house: req.body.house,
                fathername: req.body.fathername,
                mothername: req.body.mothername,
                fatherphone: req.body.fatherphone,
                motherphone: req.body.motherphone
            })

            //Fetching token json
            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            success=true;
            res.json({success,authToken})
        }
    }  catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server error occured.")
    }
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
    let success = false;
    //Checking for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {username, password,usertype} = req.body;
    try {
        let user ;
        if(usertype === "Admin"){
            user = await UserAdmin.findOne({
                username,
                usertype
            });
        }else if(usertype === "Student"){
            user = await UserStudent.findOne({
                username,
                usertype
            });
        }
        if(!user){
            success = false;
            return res.status(400).json({success,error: "Please try to login with correct credentials."})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success, error: "Please try to login with correct credentials."})
        }
       //Fetching token json
        const payload = {
            user:{
                id:user.id
            }
        }
        //digital signature using
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.json({success, authToken})


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
        const userType =  req.user.usertype
        if(userType === "Admin"){
            const user = await UserAdmin.findById(userId).select('-password');
            res.send(user)
        }else if(userType === "Student"){
            const user = await UserStudent.findById(userId).select('-password');
            res.send(user)
        }
    } catch (error) {
        res.status(500).send("Internal server error occured.")
    }
})


module.exports = router