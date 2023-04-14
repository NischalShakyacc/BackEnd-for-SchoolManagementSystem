const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017'

const connectToMongo = () => {
    mongoose
    .connect(mongoUri)
    .then(()=>{
        console.log("connected succcessful");
    })
    .catch((error)=>{
        console.log(error)
    })
    
}

module.exports=connectToMongo