const express = require('express');
var fetchuser = require('../middleware/fetchuser');
const { isValid, parseISO } = require('date-fns');
const Students = require('../models/Students');
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

const router  = express.Router();

let storage = multer.diskStorage({
    // Directory where uploaded files will be stored
    destination: 'public/studentimages',
    filename: (req,file,cb) => {
        // Rename the file with a unique name
        cb(null,Date.now()+file.originalname);
    }
})

let upload = multer({
    storage: storage
})
/*
-----------------

ROUTE 1 : Get all Student List
GET '/api/studentusers/getallstudent
get user notices'. 
* user must be logged in

-------------------
*/

router.get('/getallstudent/:classroom', fetchuser, isAdmin, async (req,res)=>{
    try{
        const classroom = req.params.classroom;
        const students = await Students.find({grade:classroom}).sort({"_id":-1});
        res.json(students)
        //res.send("here is data" + students);
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
        
        const {name, dob, address, gender, phone, house, fathername, mothername,fatherphone, motherphone } = req.body;
        
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

/*
ROUTE 4 : Get Student by id
GET '/api/studentusers/getstudent
get user info by id'. 
* user must be logged in

-------------------
*/

router.get('/getstudent/:id', fetchuser, 
async (req,res)=>{
    try{
        
        //find user to be deleted
        const { id } = req.params;
        //const student = await Students.findById(id);
        // thischange
        const student = await Students.findOne({ username: id });

        if(!student){
            res.status(404).send("Not Found");
        }else{
            res.json(student);
        }

    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})


/*
-----------------

ROUTE 4 : Update Stduen image
PUT '/api/users/updatestudentimage'. 
* user must be logged in

-------------------
*/

router.put('/updatestudentimage/:id', upload.single('image'), fetchuser,  async (req,res)=>{
    try{
        
        let image;
        if(req.file){
            image = req.file.filename;
        }
        
        const newStudent = {};
        if(image){newStudent.image = image};

        let student = await Students.findById(req.params.id);

        if(!student){
            res.status(404).send("Not Found");
        }

        if(student._id.toString() !== req.user.id){
            return res.status(401).send('Not Allowed');
        }

        student = await Students.findByIdAndUpdate(req.params.id, {$set: newStudent},{new:true})

        res.json({student})
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})


module.exports = router