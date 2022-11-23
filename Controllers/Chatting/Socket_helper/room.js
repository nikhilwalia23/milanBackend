var {User} = require("../../../Models/User/User");
module.exports = (io,socket) => 
{
    //Join all the rooms Asssocited with that User
    const joinAllrooms = (userid) => 
    {
        console.log("working ok");
    }

    socket.on('join_all_rooms',joinAllrooms);
}