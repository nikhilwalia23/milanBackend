var mongoose = require("mongoose");
var ObjectId=mongoose.ObjectId;
const chatSchema = new mongoose.Schema({
    conversations:[
        {
            type:ObjectId,ref:'Message'
        }
    ]
});
const Chat = mongoose.model('Chat',chatSchema);
module.exports = {Chat};