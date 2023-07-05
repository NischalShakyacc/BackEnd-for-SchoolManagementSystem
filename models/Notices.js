const mongoose= require("mongoose");
const {Schema} = mongoose;

const noticeSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    usernotice:{
        type: String 
    },
    attachments: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now 
    }
})

module.exports = mongoose.model('notices',noticeSchema)