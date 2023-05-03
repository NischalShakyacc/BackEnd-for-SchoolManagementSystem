const mongoose = require('mongoose');
const {Schema} = mongoose;

const resultSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'studentusers'
    },
    name:{
        type: String,
        required: true
    },
    userresult:{
        type: String 
    },
    date:{
        type: Date,
        default: Date.now 
    }
})

module.exports = mongoose.model('result',resultSchema);