const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserAdminSchema = new Schema({
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
    usertype:{
        type:String,
        default: "Admin",
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const UserAdmin = mongoose.model('adminusers',UserAdminSchema);
module.exports = UserAdmin;