const express = require('express')
const Image = require('../models/Images')
const multer = require('multer')

var fetchuser = require('../middleware/fetchuser')
//const { body, validationResult } = require('express-validator');

const router = express.Router();

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

ROUTE 1 : Get images  
GET '/api/notice/fetchnotice
get user notices'. 
* user must be logged in

-------------------
*/

router.get('/fetchprofileimage/:id', async (req,res)=>{
    try {
        //search for image associated with the user
        const userid = req.params.id;
        const profile = await Image.find({user: userid});

        res.json(profile);
    } catch (error) {
        res.status(500).send("Internal Server error occured." + error.message)
    }       
})

router.post('/addprofilephoto',
    upload.single('image'),
    fetchuser,
async (req,res)=>{
    try {
        //desctructer data from request
        const user = req.body.user;

        let image;
        if(req.file){
            image = req.file.filename;
        }

        const newImage = new Image({
            user,
            image
        });

        newImage.save()
        .then(()=>res.json(newImage))
        .catch(err => res.status(400).json(err))

    } catch (error) {
        console.log(error.message); 
        res.status(500).send("Internal Server error occured.")
    }
    
})

module.exports = router 