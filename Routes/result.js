const express = require('express');
//const connectToMongo = require('./db');
const Result = require('../models/Result')
var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

const router  = express.Router();


/*
-----------------

ROUTE 1 : Get all results 
GET '/api/auth/getuser'. 
* user must be logged in

-------------------
*/

router.get('/fetchresult', fetchuser, async (req,res)=>{
    try {
        //search for all results associated with ine user
        const results = await Result.find({user: req.user.id});
        res.json([results]);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured.")
    }       
})


/*
-----------------

ROUTE 2 : Add a new result  
GET '/api/auth/addresult'. 
* user must be logged in

-------------------
*/
router.post('/addresult',fetchuser, [
    body('name','Enter a valid name.').isLength({min:5}),
    body('userresult','Enter a valid result.').isLength({min:5}) 
],
async (req,res)=>{
    try {
        //desctructer data from request
        const {name, userresult} = req.body;

        // If errors return bad request along with errors 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }


        //creata an object to be inserted to database
        const results = new Result({
            user: req.user.id,
            name,
            userresult
        })

        //save data to database
        const savedResult = await results.save();
        res.json(savedResult) 

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})

module.exports = router 