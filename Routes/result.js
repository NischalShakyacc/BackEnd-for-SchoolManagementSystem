const express = require('express');
const Result = require('../models/Result');
var fetchuser = require('../middleware/fetchuser');
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');
const Students = require('../models/Students');


const router  = express.Router();


/*
-----------------

ROUTE 1 : Get all results 
GET '/api/result/getuser'. 
* user must be logged in

-------------------
*/

router.get('/fetchallresult/:userid', fetchuser, async (req,res)=>{
    try {
        //search for all results associated with ine user
        const userid = req.params.userid;
        const result = await Result.find({user: userid}).sort({"_id":-1});
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
router.post('/addresult/',fetchuser, isAdmin, [
    body('resulttitle','Enter a valid name.').trim().isLength({min: 5 ,max: 32}),
    body('remarks','Enter a valid remark.').trim().isLength({min: 0 ,max: 32}),
    body('subject1','Enter a valid subject.').trim().isLength({min: 0 ,max: 32}),
    body('subject2','Enter a valid subject.').trim().isLength({min: 0 ,max: 32}),
    body('subject3','Enter a valid subject.').trim().isLength({min: 0 ,max: 32}),
    body('subject4','Enter a valid subject.').trim().isLength({min: 0 ,max: 32}),
    body('subject5','Enter a valid subject.').trim().isLength({min: 0 ,max: 32}),
    body('subject6','Enter a valid subject.').trim().isLength({min: 0 ,max: 32}),
    body('subject7','Enter a valid subject.').trim().isLength({min: 0 ,max: 32}),
    body('subject8','Enter a valid subject.').trim().isLength({min: 0 ,max: 32})
],
async (req,res)=>{
    try {
        let success = false
        //desctructer data from request
        //const userid = req.params.userid

        const {user, resulttitle, remarks, subject1, subject2, subject3, subject4 ,subject5, subject6, subject7, subject8, mark1, mark2,mark3, mark4, mark5, mark6, mark7, mark8, total, percentage } = req.body;

        //Check if Student Exists


        // If errors return bad request along with errors 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const student = await Students.findOne({username: user});
            if (!student) {
                return res.status(404).json({ error: 'Student not found.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred.' });
        }

        //creates an object to be inserted to database
        const result = new Result({
            resulttitle, 
            remarks, 
            subject1, 
            subject2, 
            subject3, 
            subject4 ,
            subject5, 
            subject6, 
            subject7, 
            subject8, 
            mark1, 
            mark2,
            mark3, 
            mark4, 
            mark5, 
            mark6, 
            mark7, 
            mark8, 
            total, 
            percentage,
            user:user
        })

        //save data to database
        const savedResult = await result.save();
        success = true
        res.json({savedResult,success}) 

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
router.delete('/deleteresult/:id',fetchuser,isAdmin,
async (req,res)=>{
    try {
        let success = false;
        //Find result to be Deleted
        let result = await Result.findById(req.params.id);
        if(!result){
            return res.status(404).send("Not Found.")
        }

         //Alllow delete if user does own
        /*
        if(result.user.toString() !==  req.user.id){
            return res.status(401).send("Not Allowed.")
        }*/

        result = await Result.findByIdAndDelete(req.params.id);
        success = true;
        res.json({success,"Success":"Result Deleted",result:result})  

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})

module.exports = router 