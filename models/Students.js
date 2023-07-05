const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserStudentSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String
    },
    dob:{
        type: Date
    },
    address:{
        type: String
    },
    grade:{
        type: String
    },
    gender:{
        type: String
    },
    phone:{
        type: String
    },
    house:{
        type: String
    },
    fathername:{
        type: String
    },
    mothername:{
        type: String
    },
    fatherphone:{
        type: String
    },
    motherphone:{
        type: String
    },
    motherphone:{
        type: String
    },
    usertype:{
        type:String,
        required:true,
        default: "Student",
    },
    image: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('studentusers',UserStudentSchema);
module.exports = User;
