let {User} = require("../../Models/User/User.js");
let {Chat} = require("../../Models/Chatting/Chat.js");
let {Message} = require("../../Models/Chatting/Message");

//Match Two People (Make it MiddleWare When Intergrate with Match Making Algorithm)
let match_people = (req,res) => 
{
    let {p1,p2}=req.body;
    //Create New System Genrated Message 'Say Hello' When Two People Match
    let message= new Message({data:'Say Hello',sender:p2,receiver:p1});
    message.save((err,msg) =>
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        else
        {
            let chat = new Chat({});
            chat.conversations.push(msg);
            chat.save((err,cht) => 
            {
                if(err)
                {
                    return res.status(500).json(err);
                }
                else
                {
                    User.findById(p1,(err,user1) => 
                    {
                        if(err)
                        {
                            return res.status(500).json(err);
                        }
                        else
                        {
                            User.findById(p2,(err,user2) =>
                            {
                                if(err)
                                {
                                    return res.status(500).json(err);
                                }
                                else
                                {
                                    user1.Chats.set(String(p2),String(cht._id));
                                    user2.Chats.set(String(p1),String(cht._id));
                                    user1.Potential_dates.push(user2);
                                    user2.Potential_dates.push(user1);
                                    user1.save((err,pp1) => 
                                    {
                                        user2.save((err,pp2) => 
                                        {
                                            return res.status(200).json({"message":"Match Operation Sucessfull"});
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
module.exports = {match_people};