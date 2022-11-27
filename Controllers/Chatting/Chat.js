let {User} = require("../../Models/User/User");
//Fetch Chat Id Associated With That User
const fetchContact = (req,res) => {
    const userid = req.body.id;
    User.findById(userid, 'Potential_dates Chats', (err, user) => {
        if (err) {
            return res.status(500).json({"error":"Inernal server Error"});
        }
        else {
            let chats = [];
            for (let i = 0; i < user.Potential_dates.length; i++) {
                let chtid = user.Potential_dates[i];
                rooms.push(chtid);
            }
            return res.status(200).json({rooms});
        }
    }
    );
}
module.exports = {fetchContact};