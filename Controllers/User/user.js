const {User} = require("../../Models/User/User");
//Get User Details (Make )
const getUserDeatails = (req,res) => 
{
    let id = req.body.id;
    User.findById(id,'name username photo',(err,user) => 
    {
        if(err || !user)
        {
            return res.status(400).json({"error":"User Does not Exist"});
        }
        else
        {
            return res.status(200).json({user});
        }
    });
}
//Update User

//Give Points

//Remove Date

module.exports = {getUserDeatails};