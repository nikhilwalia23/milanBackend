let {Message} = require("../../../Models/Chatting/Message.js");
const { User } = require("../../../Models/User/User");
module.exports = (io,socket) => 
{
    //Mark as Seen Message
    const markAsSeen = (messageid) => 
    {
        Message.findByIdAndUpdate(messageid,{message_seen:true},(err,msg)=> 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log("Seen Status Update Sucessfully");
            }
        });
    }


    //fetch Old Message
    const fetchOldMessage = (userid) => 
    {
        User.findById(userid,(err,user)=> 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                //Fetch Unseen Message
                Message.find({receiver:userid,message_seen:false},(err,messages)=> 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        for(let i=0;i<messages.length;i++)
                        {
                            sendmsg(messages[i],user.Chats.get(userid));
                        }
                    }
                });
            }
        });
    }


    //Send New Message
    const createNewMessage = (userid,target) => 
    {

    }

    //Create New Message

    //Publish Message to Socket
    const sendmsg = (message,socketid)=>
    {
        socket.to(socketid).emit('new_message',message);
    }

    socket.on('create_message',createNewMessage);
    socket.on('old_message',fetchOldMessage);
    socket.on('seen_message',markAsSeen);
}