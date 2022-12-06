let {Message} = require("../../../Models/Chatting/Message.js");
let {Chat} = require("../../../Models/Chatting/Chat.js");
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


    //fetch Old Message(Testing Remaning)
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


    //Create New Message(Testing Remaning)
    const createNewMessage = (userid,target,text) => 
    {
        //Create New Message With data
        User.findById(userid,(err,user)=> 
        {
            if(err)
            {
                socket.volatile.emit('error',{msg:"Invalid User"});
            }
            else
            {
                const msg = new Message({data:text,sender:userid,receiver:target});
                msg.save((err,ms)=> 
                {
                    if(err)
                    {
                        socket.volatile.emit('error',{msg:"Internal Server Error"});
                    }
                    else
                    {    
                        Chat.findById(user.Chats.get(target),(err,cht)=> 
                        {
                            if(err)
                            {
                                socket.volatile.emit('error',{msg:"Not Permitted"});
                            }
                            else
                            {
                                cht.conversations.push(msg);
                                cht.save((err,chat)=> 
                                {
                                    if(err)
                                    {
                                        socket.volatile.emit('error',{msg:"Not Permitted"}); 
                                    }
                                    else
                                    {
                                        //Send Message to Target User
                                        sendmsg(msg,user.Chats.get(target));
                                    }
                                });
                            }
                        });
                    }
                })
            }
        });
    }


    //Publish Message to Socket
    const sendmsg = (message,socketid)=>
    {
        io.volatile.to(socketid).emit('new_message',message);
    }


    //Fetch 10 Last Message From given chat id by skiping 
    const fetchmsg = (chatid,skip) => 
    {
        console.log("reah her");
        console.log(chatid);
        //Fetch Last 10 (Still Pending)
        Chat.findById(chatid).populate('conversations').then((data)=> 
        {
            //skip last (skip) messages
            data.conversations.splice(data.conversations.length-skip,skip);
            let last = data.conversations.slice(-10);
            data.conversations=last;
            console.log(data.conversations);
            socket.emit('message',data);
        }).catch((err)=>
        {
            console.log(err);
            io.volatile.to(chatid).emit('error',err);
        })
    }

    //Mark As Seen in Message
    const mark_message = (chatid,msgid) => 
    {
        Message.findByIdAndUpdate(msgid,{message_seen:true},(err,msg)=> 
        {
            if(!err && msg) 
            {
                console.log("reach her");
                io.volatile.to(chatid).emit('update_status',{msg});
            }
        });
    }

    socket.on('create_message',createNewMessage);
    socket.on('old_message',fetchOldMessage);
    socket.on('seen_message',markAsSeen);
    socket.on('fetch_last_message',fetchmsg);
    socket.on('mark_as_read',mark_message);
    
}