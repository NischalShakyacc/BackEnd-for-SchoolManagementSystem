const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserStudentSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('studentUser',UserStudentSchema)