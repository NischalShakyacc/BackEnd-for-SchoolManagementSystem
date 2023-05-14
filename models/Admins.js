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
    usertype:{
        type:String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const UserAdmin = mongoose.model('adminusers',UserAdminSchema);
module.exports = UserAdmin;