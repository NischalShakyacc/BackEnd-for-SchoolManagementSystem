const express = require('express');
var fetchuser = require('../middleware/fetchuser');
const { isValid, parseISO } = require('date-fns');
const Teachers = require('../models/Admins');
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');

const router  = express.Router();
/*
-----------------

ROUTE 1 : Get all Teachers List
GET '/api/users/getAllTeacher
get user notices'. 
* user must be logged in

-------------------
*/


router.get('/getallteacher', fetchuser, async (req,res)=>{
    try{
        const teachers = await Teachers.find({}).sort({"_id":-1});
        res.json(teachers)
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})


/*
-----------------

ROUTE 2 : Update Teacher info
GET '/api/users/updateteacher
get user notices'. 
* user must be logged in

-------------------
*/


router.put('/updateteacher/:id', fetchuser,  
[
    body('name','Name must be longer than  4 letters.').trim().isLength({min:4}),
    body('phone','Phone number must be 10 digits.').trim().isLength({min:10}), 
    body('gender','Gender number must Male, Female or Others.').trim().isLength({min:4}),
],async (req,res)=>{
    try{
        // If errors return bad request along with errors 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        
        const {name, phone, dob, address, grade, gender } = req.body;
        
        const newTeacher = {};
        if(name){newTeacher.name = name};
        if(phone){newTeacher.phone = phone};
        if(dob){
            const parsedDate = parseISO(dob);
            
            if(!isValid(parsedDate)){
                res.status(400).json({ error: 'Invalid date of birth' });
                return;
            }
            newTeacher.dob = parsedDate;
        };
        if(address){newTeacher.address = address};
        if(grade){newTeacher.grade = grade};
        if(gender){newTeacher.gender = gender};

        //find user to be updated

        let teacher = await Teachers.findById(req.params.id);

        if(!teacher){
            res.status(404).send("Not Found");
        }

        if(teacher._id.toString() !== req.user.id){
            return res.status(401).send('Not Allowed');
        }

        teacher = await Teachers.findByIdAndUpdate(req.params.id, {$set: newTeacher},{new:true})

        res.json({teacher})
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})

/*
ROUTE 3 : Delete Teacher
GET '/api/users/updateteacher
get user notices'. 
* user must be logged in

-------------------
*/

router.delete('/deleteteacher/:id', fetchuser, isAdmin, 
async (req,res)=>{
    try{
        //find user to be deleted
        let teacher = await Teachers.findById(req.params.id);

        if(!teacher){
            res.status(404).send("Not Found");
        }

        if(teacher._id.toString() !== req.user.id){
            return res.status(401).send('Not Allowed');
        }

        teacher = await Teachers.findByIdAndDelete(req.params.id)

        res.json({"Success" : "Teacher Deleted"});
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})

module.exports = router