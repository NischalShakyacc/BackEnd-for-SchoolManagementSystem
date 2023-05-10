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
    usertype:{
        type:String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('studentusers',UserStudentSchema);
module.exports = User;