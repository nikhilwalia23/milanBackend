const { User } = require("../Models/User/User");
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail');
var singUp = (req, res) => {
    //Check Before Creating User
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({ "error": "Action Failed", err });
        }
        else {
            
            return res.status(200).json({ "message": "User Account Created", user }).status(200);
        }
    });
}
var login = (req, res) => {
    const username = req.body.username;
    const ps = req.body.password;
    User.findOne({ username }, (err, user) => {
        if (err) {
            return res.json(err).status(400);
        }
        else if (!user) {
            return res.status(404).json({ "error": "User Does not Account" });
        }
        else {
            const { name, number, role} = user;
            const id = user._id;
            if (user.authenticate(ps)) {
                jwt.sign({ id }, process.env.HASHING_KEY, { algorithm: 'HS256' }, function(err, token) {
                    if(err)
                    {
                        return res.status(400).json(err);
                    }
                    else
                    {
                        return res.status(200).json({token,name,role});
                    }
                  });
            }
            else {
                return res.status(404).json({ "error": "UserId and Password Does not Matach" });
            }
        }
    })
}
var isLogin = (req, res, next) => {
    //cookie Based Authenticate
    // if (req.cookies['token'] == undefined) {
    //     return res.status(400).json({ "error": "Token must be provided" });
    // }
    // const token = req.cookies['token'];
    const token= req.body.token;
    jwt.verify(token, process.env.HASHING_KEY, (err, curr) => {
        if (err) {
            return res.send(err);
        }
        else {
            if (curr.id == req.body.id) {
                next();
            }
            else {
                return res.status(401).json({ "error": "Acess Denied" });
            }
        }
    });
}
var isEmploye = (req, res, next) => {
    const id = req.body.id;
    User.findById(id, (err, user) => {
        if (err) {
            return res.status(400).json(err);
        }
        else {
            if (user.role == 1) {
                next();
            }
            else {
                return res.status(403).json({ "error": "You are not eligible for this operation" });
            }
        }
    });
}
var welcome = (req, res) => {

    res.send("you are logged in");
}
let forgetPassword = (req, res) => {
    const email = req.body.email;
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!user) {
            return res.status(404).json({ "error": "email does not exist" });
        }
        else {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            let url = String(process.env.CLIENT_URL);
            const id = String(user._id);
            jwt.sign({ id }, process.env.HASHING_KEY, (err, token) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json(err);
                }
                else {
                    url = url + '/resetForm/' + token;
                    console.log(url);
                    const msg = {
                        to: email,
                        from: process.env.EMAIL_FROM, // Use the email address or domain you verified above
                        subject: 'Reset Password',
                        text: 'nothing showing',
                        html: `<strong>Click on Link to Change Passowrd</strong> <a href=${url}>Click Me</a>`,
                    };
                    user.resetString = token;
                    user.save().then( doc => {
                        sgMail
                            .send(msg)
                            .then(() => { user.resetString = token; return res.status(200).json({ "message": "working fine" }); }, error => {
                                console.error(error);
                                if (error.response) {
                                    return res.status(400).json(error.response.body);
                                }
                            })
                    }
                    );
                }
            });
        }
    });
}
let ressetPassword = (req, res) => {
    const { password, token } = req.body;
    if(!token)
    {
        return res.status(401).json({"error":"Invalid Token"});
    }
    jwt.verify(token,process.env.HASHING_KEY,(err,decoded) => 
    {
        if(err)
        {
            return res.status(400).json({"error":"Invalid Token"});
        }
        else
        {
            const id = decoded.id;
            User.findById(id,(err,user) => 
            {
                if(err || !user || user.resetString!=token)
                {
                    return res.status(400).json({"error":"Token Expired"});
                }
                else
                {
                    user.password=password;
                    user.resetString="";
                    user.save((usr) => 
                    {
                        return res.status(200).json({"msg":"Password Updated"});
                    });
                }
            });
            // return res.status(200).json(decoded);
        }
    });
}
//validate function for Socket io 
let validate = (id,token)=>
{
    let flag=false;
    jwt.verify(token, process.env.HASHING_KEY, (err, curr) => {
        if (err) {
            return;
        }
        else {
            if (curr.id == id) {
                flag=true;
                return true;
            }
        }
    });
    return flag;
}
module.exports = { singUp, login, isLogin, welcome, isEmploye, forgetPassword, ressetPassword,validate};