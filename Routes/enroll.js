const express = require('express');
var fetchuser = require('../middleware/fetchuser');
const { isValid, parseISO } = require('date-fns');
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');
const Enrollment = require('../models/Enrollment');

const router  = express.Router();

/*
-----------------

ROUTE 1 : Get all enrollment forms
GET '/api/enroll/getenrolls
get user notices'. 
* user must be logged in

-------------------
*/

router.get('/getenrolls', fetchuser, isAdmin, async (req,res)=>{
    try{
        const enrolls = await Enrollment.find({}).sort({"_id":-1});
        res.json(enrolls)
        //res.send("here is data" + students);
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})

/*
-----------------

ROUTE 2 : Insert enroll data
GET '/api/enroll/addenroll
update user information'. 
* user must be logged in

-------------------
*/
router.post('/addenroll', [
    body('firstName','Required.').trim().isLength({min:0}),
    body('lastname','Required.').trim().isLength({min:0}), 
    body('gender','Required.').trim().isLength({min:0}), 
    body('city','Required.').trim().isLength({min:0}), 
    body('fathername','Required.').trim().isLength({min:0})
],async (req,res)=>{
    try {
        const {
            firstName,
            middleName,
            lastName,
            gender,
            streetAddress,
            wardno,
            city,
            country,
            nation,
            dob,
            fathername,
            fatherphone,
            mothername,
            motherphone,
            officename,
            officephone,
            guardianname,
            guardianphone,
            relation,
            emergencyname,
            emergencyphone,
            emergencyaddress,
            prevschool,
            prevschooladdress,
            prevschoolphone,
            accessrequirements,
            busaddress,
            grade,
            filler
        } = req.body;

        //validation error results
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        //search for all notices to display
        const enroll = new Enrollment({
            firstName,
            middleName,
            lastName,
            gender,
            streetAddress,
            wardno,
            city,
            country,
            nation,
            dob,
            fathername,
            fatherphone,
            mothername,
            motherphone,
            officename,
            officephone,
            guardianname,
            guardianphone,
            relation,
            emergencyname,
            emergencyphone,
            emergencyaddress,
            prevschool,
            prevschooladdress,
            prevschoolphone,
            accessrequirements,
            busaddress,
            grade,
            filler
        });
        const saveenroll = await enroll.save()
        res.json(saveenroll);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured." + error.message)
    }       
})

/*
ROUTE 3 : Delete enroll data
GET '/api/enroll/deleteenroll
get user notices'. 
* user must be logged in

-------------------
*/

router.delete('/deleteenroll/:id', fetchuser, isAdmin, 
async (req,res)=>{
    try{
        
        //find enroll to be deleted
        let enroll = await Enrollment.findById(req.params.id);

        if(!enroll){
            res.status(404).send("Not Found");
        }

        student = await Enrollment.findByIdAndDelete(req.params.id)

        res.json({"Success" : "Enroll Data Deleted"});
    }catch(error){
        res.status(500).send("Internal Server error occured." + error.message)
    }
})

/*
-----------------

ROUTE 4  : Delete existing enrollment 
GET '/api/enroll/deleteenroll'. 
* user must be logged in
-------------------
*/
router.delete('/deleteenroll/:id',fetchuser,
async (req,res)=>{
    try {
        //desctructer data from request

        //Find result to be Deleted
        let enroll = await Enrollment.findById(req.params.id);
        if(!notice){
            return res.status(404).send("Not Found.")
        }

        notice = await Notice.findByIdAndDelete(req.params.id)
        res.json({"Success":"Notice is deleted."})  

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})

module.exports = router

/*
accessrequirements: "NO",
busaddress: "Yes",
city: "Lalitpur",
country: "Nepal",
date: "",
dob: "2023-06-06",
emergencyaddress: "98555"emergencyname: "asdasd",
emergencyphone: "9999",
fathername: "Nabin",
fatherphon: "9841401174",
filler: "Nischal Shakya",
firstName: "nischal",
gender: "Male",
grade: "10",
guardianname: "Nabin",
guardianphone: "9841401174",
lastName: "Shakya",
middleName: "man ",
mothername: "Arina",
motherphone: "9849103495",
nation: "nepalese",
officename: "Silver",
officephone: "5534701",
prevschool: "delight",
prevschooladdress: "thasikhel",
prevschoolphone: "55348888",
relation: "Father",
streetAddress: "Gwarko",
wardno: "7"
*/