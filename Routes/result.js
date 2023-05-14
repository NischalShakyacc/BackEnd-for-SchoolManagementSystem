const express = require('express');
//const connectToMongo = require('./db');
const Result = require('../models/Result')
var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

const router  = express.Router();


/*
-----------------

ROUTE 1 : Get all results 
GET '/api/result/getuser'. 
* user must be logged in

-------------------
*/

router.get('/fetchresult', fetchuser, async (req,res)=>{
    try {
        //search for all results associated with ine user
        const result = await Result.find({user: req.user.id});
        res.json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured." + error.message)
    }       
})


/*
-----------------

ROUTE 2 : Add a new result  
GET '/api/result/addresult'. 
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
        const result = new Result({
            name,
            userresult,
            user: req.user.id,
        })

        //save data to database
        const savedResult = await result.save();
        res.json(savedResult) 

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})


/*
-----------------

ROUTE 3 :Update existing result 
GET '/api/result/updateresult'. 
* user must be logged in
-------------------
*/
router.put('/updateresult/:id',fetchuser, [
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
        const newResult = {};
        if(name){newResult.name = name};
        if(userresult){newResult.userresult = userresult};

        //Find result to be Updated
        let result = await Result.findById(req.params.id);
        if(!result){
            return res.status(404).send("Not Found.")
        }

        //Alllow Update if user does own
        if(result.user.toString() !==  req.user.id){
            return res.status(401).send("Not Allowed.")
        }

        result = await Result.findOneAndUpdate(req.params.id,{$set: newResult},{new:true}); 

        res.json({result}) 

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})


/*
-----------------

ROUTE 4  : Delete existing result 
GET '/api/result/deletresult'. 
* user must be logged in
-------------------
*/
router.delete('/deleteresult/:id',fetchuser,
async (req,res)=>{
    try {

        //Find result to be Deleted
        let result = await Result.findById(req.params.id);
        if(!result){
            return res.status(404).send("Not Found.")
        }

         //Alllow delete if user does own
        if(result.user.toString() !==  req.user.id){
            return res.status(401).send("Not Allowed.")
        }

        result = await Result.findByIdAndDelete(req.params.id)
        res.json({"Success":"Result Deleted",result:result})  

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})

module.exports = router 