const { Chat } = require("../../../Models/Chatting/Chat");
var {User} = require("../../../Models/User/User");
const { fetchContact } = require("../Chat");
module.exports = (io,socket) => 
{
    //Helper Function
    const sendmsg = (message,socketid)=>
    {
        socket.to(socketid).volatile.emit('new_message',message);
    }

    //Join all the rooms Asssocited with that User(Test FrontEnd Listing Events)
    const joinAllrooms = (userid) => 
    {
        User.findById(userid,'Potential_dates Chats',(err,user) => 
        {
            if(err)
            {
                console.log("Internal Server Error");
            }
            else
            {
                for(let i=0;i<user.Potential_dates.length;i++)
                {
                    let chtid= user.Chats.get(user.Potential_dates[i]);
                    socket.join(chtid);
                    //Send Old Unseen Message from DataBase From This Channel
                    Chat.findById(user.Chats.get(user.Potential_dates[i])).populate({path:'conversations',match:{message_seen:false}}).exec((err,messages)=> 
                    {
                        if(err)
                        {
                            socket.volatile.emit('error',{error:"Internal Server Errror"});
                        }
                        else
                        {
                            //Send All Unseen Messages To Client
                            for(let i=0;i<messages.lenght;i++)
                            {
                                sendmsg(messages[i],chtid);
                            }
                        }
                    });
                }
            }
        });
    }

    //Fetch Chat Id Associated With That User
    const fetchContact = (userid) => {
        User.findById(userid, 'Potential_dates Chats', (err, user) => {
            if (err) {
                console.log("Internal Server Error");
            }
            else {
                let arr = [];
                for (let i = 0; i < user.Potential_dates.length; i++) {
                    let chtid = user.Chats.get(user.Potential_dates[i]);
                    arr.push(chtid);
                }
                return arr;
            }
        }
        );
    }
    socket.on('join_all_rooms',joinAllrooms);
    socket.on('fetch_all_rooms',fetchContact);
}