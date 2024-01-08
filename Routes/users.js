const express = require('express');
var fetchuser = require('../middleware/fetchuser');
const { isValid, parseISO } = require('date-fns');
const Teachers = require('../models/Admins');
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

const router  = express.Router();

let storage = multer.diskStorage({
    // Directory where uploaded files will be stored
    destination: 'public/profileimages',
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
GET '/api/users/updateteacher'
* user must be logged in

-------------------
*/

router.put('/updateteacher/:id', fetchuser,  isAdmin,
[
    body('name','Name must be longer than  4 letters.').trim().isLength({min:4,max:50}),
    body('phone','Phone number must be 10 digits.').trim().isLength({min:10}), 
    body('gender','Gender number must Male, Female or Others.').trim().isLength({min:4}),
    body('address','Enter Valid Address.').trim().isLength({min:4}),
    body('grade','Enter Valid Grade.').trim().isIn(['Toddler', 'Nursery','KG','1','2','3','4','5','6','7','8','9','10']),
    body('email','Enter Valid Email.').isEmail()
],async (req,res)=>{
    try{
        let success = false;
        // If errors return bad request along with errors 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors: errors.array()});
        }
        
        const {name, phone, dob, address, grade, gender, email } = req.body;
        
        const newTeacher = {};
        if(name){newTeacher.name = name};
        if(phone){newTeacher.phone = phone};
        if(dob){
            const parsedDate = parseISO(dob);
            if(!isValid(parsedDate)){
                res.status(400).json({ success, error: 'Invalid date of birth' });
                return;
            }
            newTeacher.dob = parsedDate;
        };
        if(address){newTeacher.address = address};
        if(grade){newTeacher.grade = grade};
        if(gender){newTeacher.gender = gender};
        if(email){newTeacher.email = email};

        //find user to be updated

        let teacher = await Teachers.findById(req.params.id);

        if(!teacher){
            res.status(404).send("Not Found");
            return res.status(400).json({success,message: 'User not found'});
        }

        if(teacher._id.toString() !== req.user.id){
            return res.status(401).send('Not Allowed');
        }

        teacher = await Teachers.findByIdAndUpdate(req.params.id, {$set: newTeacher},{new:true})
        success= true;
        res.json({success,teacher})
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})

/*
ROUTE 3 : Delete Teacher
Delete '/api/users/deleteteacher
'. 
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

/*
-----------------

ROUTE 4 : Update Teacher image
PUT '/api/users/updateteacher'. 
* user must be logged in

-------------------
*/

router.put('/updateteacherimage/:id', upload.single('image'), fetchuser,  async (req,res)=>{
    try{
        
        let image;
        if(req.file){
            image = req.file.filename;
        }
        
        const newTeacher = {};
        if(image){newTeacher.image = image};

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

module.exports = router