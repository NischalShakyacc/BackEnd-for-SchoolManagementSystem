const mongoose = require('mongoose');
const {Schema} = mongoose;

const resultSchema = new Schema({
    user:{
        type: String,
        required: true
    },
    resulttitle:{
        type: String,
        required: true
    },
    remarks:{
        type: String
    },
    subject1:{
        type: String,
        default: "No Subject"
    },
    subject2:{
        type: String ,
        default: "No Subject"
    },
    subject3:{
        type: String ,
        default: "No Subject"
    },
    subject4:{
        type: String ,
        default: "No Subject"
    },
    subject5:{
        type: String ,
        default: "No Subject"
    },
    subject6:{
        type: String ,
        default: "No Subject"
    },
    subject7:{
        type: String ,
        default: "No Subject"
    },
    subject8:{
        type: String ,
        default: "No Subject"
    },
    mark1:{
        type: String 
    },
    mark2:{
        type: String 
    },
    mark3:{
        type: String 
    },
    mark4:{
        type: String 
    },
    mark5:{
        type: String 
    },
    mark6:{
        type: String 
    },
    mark7:{
        type: String 
    },
    mark8:{
        type: String 
    },
    total:{
        type: String 
    },
    percentage:{
        type: String 
    },
    date:{
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('result',resultSchema);