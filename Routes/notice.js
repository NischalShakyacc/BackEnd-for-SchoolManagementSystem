const express = require('express')
const Notice = require('../models/Notices')


const router = express.Router();
/*
-----------------

ROUTE 1 : Get all results 
GET '/api/notice/fetchnotice
get user notices'. 
* user must be logged in

-------------------
*/

router.get('/fetchnotice', fetchuser, async (req,res)=>{
    try {
        //search for all results associated with ine user
        const notice = await Notice.stringify() ;
        res.json(notice);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured." + error.message)
    }       
})