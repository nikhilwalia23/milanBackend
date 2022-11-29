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
                }
            }
        });
    }
    socket.on('join_all_rooms',joinAllrooms);
}