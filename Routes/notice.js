const express = require('express')
const Notice = require('../models/Notices')

var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const router = express.Router();
/*
-----------------

ROUTE 1 : Get all notices 
GET '/api/notice/fetchnotice
get user notices'. 
* user must be logged in

-------------------
*/

router.get('/fetchnotice', fetchuser, async (req,res)=>{
    try {
        //search for all notices associated with any user
        const notices = await Notice.find({}).sort({"_id":-1});
        res.json(notices);
    } catch (error) {
        res.status(500).send("Internal Server error occured." + error.message)
    }       
})

/*
-----------------

ROUTE 2 : Add notices
GET '/api/notice/addnotice
add user notices'. 
* admin must be logged in

-------------------
*/

router.post('/addnotice', fetchuser, [
    body('title','Enter a longer title.').trim().isLength({min:5}),
    body('usernotice','User notice must be at least 10 lettes.').isLength({min:10}) 
],async (req,res)=>{
    try {
        const {title,usernotice} = req.body;

        //validation error results
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        //search for all notices to display
        const notice = new Notice({
            title,
            usernotice
        });
        const savedNotice = await notice.save()
        res.json(savedNotice);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured." + error.message)
    }       
})

/*
-----------------

ROUTE 3 :Update existing notice 
GET '/api/notice/updatenotice'. 
* user must be logged in
-------------------
*/
router.put('/updatenotice/:id',fetchuser, [
    body('title','Title must be longer than 10 letter.').trim().isLength({min:10}),
    body('usernotice','Enter a longer notice.').trim().isLength({min:10}) 
],
async (req,res)=>{
    try {
        //desctructer data from request
        const {title, usernotice} = req.body;

        // If errors return bad request along with errors 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        //creat an object to be inserted to database
        const newNotice = {};
        if(title){newNotice.title = title};
        if(usernotice){newNotice.usernotice = usernotice};

        //Find notice to be Updated
        let notice = await Notice.findById(req.params.id);
        if(!notice){
            return res.status(404).send("Not Found.")
        }

        notice = await Notice.findOneAndUpdate(req.params.id,{$set: newNotice},{new:true}); 

        res.json({notice}) 

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})

/*
-----------------

ROUTE 4  : Delete existing notice 
GET '/api/norice/deletenotice'. 
* user must be logged in
-------------------
*/
router.delete('/deletenotice/:id',fetchuser,
async (req,res)=>{
    try {
        //desctructer data from request

        //Find result to be Deleted
        let notice = await Notice.findById(req.params.id);
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