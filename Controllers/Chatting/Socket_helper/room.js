var {User} = require("../../../Models/User/User");
module.exports = (io,socket) => 
{
    //Join all the rooms Asssocited with that User
    const joinAllrooms = (userid) => 
    {
        User.findById(userid,'Potential_dates',(err,user) => 
        {
           for(let i=0;i<user.Potential_dates.length;i++)
           {
                socket.join(user.Potential_dates[i]);
                //Send Old Unseen Message from DataBase From This Channel
                io.to(user.Potential_dates[i]).emit("old_message",{message:"hello from server"});
                //Some Testing Is Pending Done After FrontEnd FUll Integration
           }
        });
    }
    socket.on('join_all_rooms',joinAllrooms);
}