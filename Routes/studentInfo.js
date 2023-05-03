const express = require('express');
//const connectToMongo = require('./db');
var fetchuser = require('../middleware/fetchuser')

const router  = express.Router();


/*
-----------------
Start of ROUTE 1 : Get all results 
GET '/api/auth/getuser'. 
* user must be logged in
-------------------
*/

router.get('/', fetchuser, (req,res)=>{
    obj = {
        a: 'nscihal',
        number: 34
    }

    res.json(obj);
})

module.exports = router