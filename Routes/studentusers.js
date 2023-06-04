const express = require('express');
var fetchuser = require('../middleware/fetchuser');
const { isValid, parseISO } = require('date-fns');
const Students = require('../models/Students');
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');

const router  = express.Router();

/*
-----------------

ROUTE 1 : Get all Student List
GET '/api/studentusers/getallstudent
get user notices'. 
* user must be logged in

-------------------
*/

router.get('/getallstudent', fetchuser,isAdmin, async (req,res)=>{
    try{
        const students = await Students.find({}).sort({"_id":-1});
        res.json(students)
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})

/*
-----------------

ROUTE 2 : Update Student info
GET '/api/studentusers/updatestudent
update user information'. 
* user must be logged in

-------------------
*/

router.put('/updatestudent/:id', fetchuser, 
[
    body('name','Name must be longer than  4 letters.').trim().isLength({min:4}),
    body('phone','Phone number must be 10 digits.').trim().isLength({min:10}), 
    body('gender','Gender number must Male, Female or Others.').trim().isLength({min:4}),
],async (req,res)=>{
    try{
        let success = true;
        // If errors return bad request along with errors 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            success = false;
            return res.status(400).json({errors: errors.array()});
        }
        
        const {name, dob, address, grade, gender, phone, house, fathername, mothername,fatherphone, motherphone } = req.body;
        
        const newStudent = {};
        if(name){newStudent.name = name};
        if(dob){
            const parsedDate = parseISO(dob);
            if(!isValid(parsedDate)){
                res.status(400).json({ error: 'Invalid date of birth' });
                success = false;
                return;
            }
            newStudent.dob = parsedDate;
        };
        if(phone){newStudent.phone = phone};
        if(address){newStudent.address = address};
        if(grade){newStudent.grade = grade};
        if(gender){newStudent.gender = gender};
        if(house){newStudent.house = house};
        if(fathername){newStudent.fathername = fathername};
        if(mothername){newStudent.mothername = mothername};
        if(fatherphone){newStudent.fatherphone = fatherphone};
        if(motherphone){newStudent.motherphone = motherphone};

        //find user to be updated

        let student = await Students.findById(req.params.id);

        if(!student){
            res.status(404).send("Not Found");
            success = false;
        }

        if(student._id.toString() !== req.user.id){
            success = false;
            return res.status(401).send('Not Allowed');

        }

        student = await Students.findByIdAndUpdate(req.params.id, {$set: newStudent},{new:true})

        res.json({success,student})
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})


/*
ROUTE 3 : Delete Student
GET '/api/studentusers/updatestudent
get user notices'. 
* user must be logged in

-------------------
*/

router.delete('/deletestudent/:id', fetchuser, isAdmin, 
async (req,res)=>{
    try{
        //find user to be deleted
        let student = await Students.findById(req.params.id);

        if(!student){
            res.status(404).send("Not Found");
        }

        student = await Students.findByIdAndDelete(req.params.id)

        res.json({"Success" : "Student Deleted"});
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})

module.exports = router