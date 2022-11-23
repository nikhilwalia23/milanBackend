var {Message} = require("../../Models/Chatting/Message");
var {Chat} = require("../../Models/Chatting/Chat")
const sendMessage = (sender,receiver,chatid,data) => 
{
    Chat.findById(chatid,(err,chat)=> 
    {
        if(err)
        {
            return err;
        }
        else
        {
            //Create New Message
            const msg = new Message({data,sender,receiver});
            msg.save((err,message) => 
            {
                if(err)
                {
                    return err;
                }
                else
                {
                    chat.conversations.push(message._id);
                    chat.save((err,cht)=> 
                    {
                        if(err)
                        {
                            return err;
                        }
                        else
                        {
                            return cht;
                        }
                    });
                }
            })
        }
    })
}
module.exports = {sendMessage};