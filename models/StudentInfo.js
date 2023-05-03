const mongoose = require('mongoose');
const {Schema} = mongoose;

const StudentInfoSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{ 
        type: String,
        required: true
    },
    fullName:{
        type: Date,
        required:true
    },
    age:{
        type: Number,
    },
    grade:{
        type: String,
    },
    address:{
        type: String,
    },
})

module.exports = mongoose.model('studentInfo',StudentInfoSchema)