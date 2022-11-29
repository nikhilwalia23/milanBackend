let {User} = require("../../Models/User/User");
//Fetch Chat Id Associated With That User
const fetchContact = (req,res) => {
    const userid = req.body.id;
    User.findById(userid).populate({ path: 'Potential_dates', select: 'name photo _id'}).exec((err,users)=> 
    {
        if(err)
        {
            return res.status(400).json(err);
        }
        else
        {
            return res.status(200).json(users.Potential_dates);
        }
    });
}
module.exports = {fetchContact};