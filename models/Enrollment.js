const mongoose = require('mongoose');
const {Schema} = mongoose;

const enrollmentSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    middleName:{
        type: String,
        required: true
    },
    lastName:{
        type: String
    },
    gender:{
        type: String,
    },
    streetAddress:{
        type: String ,
    },
    wardno:{
        type: String ,
    },
    city:{
        type: String ,
    },
    country:{
        type: String 
    },
    nation:{
        type: String ,
    },
    dob:{
        type: Date ,
    },
    fathername:{
        type: String ,
    },
    fatherphone:{
        type: String 
    },
    mothername:{
        type: String 
    },
    motherphone:{
        type: String 
    },
    officename:{
        type: String 
    },
    officephone:{
        type: String 
    },
    guardianname:{
        type: String 
    },
    guardianphone:{
        type: String 
    },
    relation:{
        type: String 
    },
    emergencyname:{
        type: String 
    },
    emergencyphone:{
        type: String 
    },
    emergencyaddress:{
        type: String 
    },
    prevschool:{
        type: String 
    },
    prevschooladdress:{
        type: String 
    },
    prevschoolphone:{
        type: String 
    },
    accessrequirements:{
        type: String 
    },
    busaddress:{
        type: String 
    },
    grade:{
        type: String 
    },
    filler:{
        type: String 
    },
    date:{
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('enroll',enrollmentSchema);