const express = require('express');
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


router.post('/createuser', fetchuser, isAdmin,
    [
        body('username',"Invalid Username.").trim().isLength({min:5, max:32}),
        body('password','Bad password').isLength({min:5, max:32}),
        body('name',"Name must be longer").trim().isLength({min:4, max:50}),
        body('usertype',"Cannot be empty.").trim().isIn(['Admin', 'Student']),
        body('grade',"Cannot be empty.").trim().isIn(['Toddler', 'Nursery','KG','1','2','3','4','5','6','7','8','9','10']),
        body('email',"Enter Valid email.").trim().isEmail()
    ]
,async (req,res)=>{
    let success = false;

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
                phone: req.body.phone,
                email: req.body.email,
                //image: Image
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
                motherphone: req.body.motherphone,
                email: req.body.email
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
    body('username', 'Not a valid username').exists(),
    body('password', 'Password cannot be empty.').exists(),
],async (req, res) =>{
    let success = false;
    //Checking for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {username,password,usertype} = req.body;
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
                id : user.id,
                usertype : user.usertype
            }
        }
        //digital signature using
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.json({success, authToken})


    } catch (error) {
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
Start of ROUTE 3 : Change Password
Get a user's details: POST '/api/auth/getuser'. 
* required user to be logged in
-------------------
*/
router.put('/changepassword',fetchuser, [
    body('newPassword', 'Password should be 5 to 32 characters.').exists().isLength({min:5, max:32})],
    async (req, res) =>{
    try {
        //Encrypting the password (hashing)
        let success = false;
        const salt = await bcrypt.genSalt(10);

        const {id, currentpassword, newPassword} = req.body;

        const adminuser = await UserAdmin.findOne({_id: id});
        if(adminuser){
            const passwordCompare = await bcrypt.compare(currentpassword, adminuser.password);
            if(passwordCompare){
                const secPassword = await bcrypt.hash(newPassword,salt);
                adminuser.password = secPassword;
                await adminuser.save();
                success = true;
                res.json({ success, message: 'Password changed successfully.' });
                return
            }
        }
        //if not admin
        const studentuser = await UserStudent.findOne({_id:id});
        if(studentuser){
            const compareStdPassword = await bcrypt.compare(currentpassword, studentuser.password);
            if(compareStdPassword){
                const secPassword = await bcrypt.hash(newPassword,salt);
                studentuser.password = secPassword;
                await studentuser.save();
                success = true;
                res.json({ success, message: 'Password changed successfully.' });
                return
            }
        }

        res.json({ success, message: 'Invalid Data.' });

    } catch (error) {
        res.status(500).send("Internal Server Error Ocuured." + error)
    }
})


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

        let user = await UserAdmin.findById(userId).select('-password');

        //if not admin
        if(!user){
            let user = await UserStudent.findById(userId).select('-password');
            res.send(user);
            return
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("Internal Server Error Ocuured." + error)
    }
})


module.exports = router