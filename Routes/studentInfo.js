const express = require('express');
//const connectToMongo = require('./db');

const router  = express.Router();

router.get('/',(req,res)=>{
    obj = {
        a: 'nscihal',
        number: 34
    }

    res.json(obj);
})

module.exports = router