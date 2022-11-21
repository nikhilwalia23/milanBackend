var mongoose = require("mongoose");
var ObjectId=mongoose.ObjectId;
const messageSchema = new mongoose.Schema({
    data: 
    {
        type: String
    },
    sender: 
    {
        type: ObjectId,
        ref: 'User'
    },
    receiver:
    {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    message_seen:
    {
        type: Boolean,
        default: false
    }

},{timestamps:true});
const Message = mongoose.model('Message',messageSchema);
module.exports = {Message};