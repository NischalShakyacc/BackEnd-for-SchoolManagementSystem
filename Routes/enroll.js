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
    body('firstName','Required.').trim().isLength({min:0,max:32}),
    body('lastName','Required.').trim().isLength({min:0,max:32}), 
    //body('middleName','Required.').trim(), 
    body('gender','Required.').trim().isLength({min:0,max:32}), 
    // body('streetAddress','Required.').trim().isLength({min:0,max:32}),
    // body('wardno','Required.').trim().isLength({min:0,max:32}),
    // body('city','Required.').trim().isLength({min:0,max:32}),
    // body('country','Required.').trim().isLength({min:0,max:32}),
    // body('nation','Required.').trim().isLength({min:0,max:32}),
    // body('dob','Required.').trim().isLength({min:0,max:32}),
    // body('fathername','Required.').trim().isLength({min:0,max:32}),
    // body('fatherphone','Required.').trim().isLength({min:0,max:32}),
    // body('mothername','Required.').trim().isLength({min:0,max:32}),
    // body('motherphone','Required.').trim().isLength({min:0,max:32}),
    // body('officename','Required.').trim().isLength({min:0,max:32}),
    // body('officephone','Required.').trim().isLength({min:0,max:32}),
    // body('guardianname','Required.').trim().isLength({min:0,max:32}),
    // body('guardianphone','Required.').trim().isLength({min:0,max:32}),
    // body('relation','Required.').trim().isLength({min:0,max:32}),
    // body('emergencyname','Required.').trim().isLength({min:0,max:32}),
    // body('emergencyaddress','Required.').trim().isLength({min:0,max:32}),
    // body('emergencyphone','Required.').trim().isLength({min:0,max:32}),
    // body('prevschool','Required.').trim().isLength({min:0,max:32}),
    // body('prevschooladdress','Required.').trim().isLength({min:0,max:32}),
    // body('prevschoolphone','Required.').trim().isLength({min:0,max:32}),
    // body('accessrequirements','Required.').trim().isLength({min:0,max:32}),
    // body('busaddress','Required.').trim().isLength({min:0,max:32}),
    // body('grade','Required.').trim().isLength({min:0,max:32}),
    // body('filler','Required.').trim().isLength({min:0,max:32})
],async (req,res)=>{
    try {
        let success = false;

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
            grade
            
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
            grade
        });
        const saveenroll = await enroll.save();
        success = true;
        res.json({saveenroll, success});
        
    } catch (error) {
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
        res.status(500).send("Internal Server error occured.")
    }
    
})

*/

module.exports = router

