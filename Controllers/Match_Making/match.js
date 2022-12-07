let {User} = require("../../Models/User/User.js");
let {Chat} = require("../../Models/Chatting/Chat.js");
let {Message} = require("../../Models/Chatting/Message");
const { Post } = require("../../Models/Post/Post.js");

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


//Find Best Suited People
let find_match = (req,res) => 
{
    let id = req.body.id;
    User.findById(id,(err,p)=> 
    {
        if(err || !p)
        {
            return res.status(400).json({"error":"You Are Boat"});
        }
        else
        {

            let data=null;
            let match_values=0;
            User.find({gender:p.Target_gender},(err,users)=> 
            {
                if(err)
                {
                    return res.status(200).json({"error":"Sorry We Don't have Date For You"});
                }
                else
                {
                    //Calculare Score For All Users Send Best Match Profile
                    //Z_Score = w1*(min(x1,y1))+w2*(min(x2,y2)+w3*(min(x3,y3))+..........+wn*(min(xn,yn)))
                    let n  = 6; // n-> number of Varrible
                    let weight = [20,20,10,10,10,30];
                    let fvalue = Array(n).fill(100);
                    let field_name = ['cricket','football','bjp','congress','feminism','religious_liberals'];
                    for(let i=0;i<p.likes.length;i++)
                    {
                        //Find Post Details
                        let pid = p.likes[i];
                        Post.findById(pid,(err,pst)=> 
                        {
                            if(err)
                            {
                                console.log("Something wrong with post id");
                            }
                            else
                            {
                                //Loop through Category
                                for(let cat=0;cat<n;cat++)
                                {
                                    let txt = field_name[cat];
                                    fvalue[cat]=fvalue[cat]+pst[txt];
                                    console.log(fvalue[cat]);
                                }
                            }
                        });
                    }
                    // Just Debuging
                    for(let cat=0;cat<n;cat++)
                    {
                        console.log(fvalue[cat]);
                    }
                    console.log("Debuggin Cloes")
                    //Normalise Value
                    fvalue = fvalue.map((num)=> {return num/(p.likes.length)});
                    

                    //Loop Through All Other Users
                    users.forEach(user => {
                        let svalue = Array(n).fill(100);

                        //Make This Code Synchroous (Inside Loop)
                        for (let i = 0; i < user.likes.length; i++) {
                            //Find Post Details
                            let pid = user.likes[i];
                            Post.findById(pid, (err, pst) => {
                                if (err) {
                                    console.log("Something wrong with post id");
                                }
                                else {
                                    //Loop through Category
                                    for (let cat = 0; cat < n; cat++) {
                                        let txt = field_name[cat];
                                        svalue[cat] = svalue[cat] + pst[txt];
                                        // if(user.username=='shivanshi61')
                                        // {
                                        //     console.log(svalue[cat]);
                                        // }
                                    }
                                }
                            });
                        }
                         
                        // Just Debuging
                        // for(let cat=0;cat<n && user.username=='shivanshi61';cat++)
                        // {
                        //     console.log(svalue[cat]);
                        // }
                        // if(user.username=='shivanshi61'){console.log("Debuing");}
                        

                        //Normalise Value
                        svalue = svalue.map((num)=> {return num/(user.likes.length+1)});
                        

                        

                        let curr_score=0;
                        //Caluecating Score For Current User
                        for(let cat=0;cat<n;cat++)
                        {
                            curr_score=curr_score+ (weight[cat]) * (Math.min(fvalue[cat],svalue[cat]));
                        }
                        if(curr_score>match_values)
                        {
                            match_people=curr_score;
                            data=user._id;
                        }
                    });



                    if(match_values==0)
                    {
                        return res.status(500).json({"error":"Sorry, We don't Have Match for you"});
                    }
                    else
                    {
                        return res.status(200).json(data);
                    }

                }
            });
        }
    })
}

//Send Sync Insert
async function find_match_sync(req,res) 
{
    let id = req.body.id;
    let p = await User.findById(id);
    let data=null;
    let match_values=0;
    let users=await User.find({gender:p.Target_gender});

    //Calculare Score For All Users Send Best Match Profile
    //Z_Score = w1*(min(x1,y1))+w2*(min(x2,y2)+w3*(min(x3,y3))+..........+wn*(min(xn,yn)))
    let n = 6; // n-> number of Varrible
    let weight = [20, 20, 10, 10, 10, 30];
    let fvalue = Array(n).fill(100);
    let field_name = ['cricket', 'football', 'bjp', 'congress', 'feminism', 'religious_liberals'];
    for (let i = 0; i < p.likes.length; i++) {
        //Find Post Details
        let pid = p.likes[i];
        let pst = await Post.findById(pid);
        //Loop through Category
        for (let cat = 0; cat < n; cat++) 
        {
            let txt = field_name[cat];
            fvalue[cat] = fvalue[cat] + pst[txt];
        }
    }


    //Normalise Value
    fvalue = fvalue.map((num)=> {return num/(p.likes.length)});
    for(let user of users)
    {
        let svalue = Array(n).fill(100);
        for(let i = 0; i < user.likes.length; i++) 
        {
            //Find Post Details
            let pid = user.likes[i];
            let pst = await Post.findById(pid);
            //Loop through Category
            for (let cat = 0; cat < n; cat++) {
                let txt = field_name[cat];
                svalue[cat] = svalue[cat] + pst[txt];
            }
        }

         //Normalise Value
         svalue = svalue.map((num)=> {return user.likes.length==0 ? num/2 : num/(user.likes.length+1)});
        
        let curr_score=0;
        //Caluecating Score For Current User
        for(let cat=0;cat<n;cat++)
        {
            curr_score=curr_score+ (weight[cat]) * (Math.min(fvalue[cat],svalue[cat]));
        }
        if(curr_score>match_values)
        {
            match_people=curr_score;
            data=user._id;
        }
        console.log(curr_score);
    }
    return res.status(200).json(data);
}

module.exports = {match_people,find_match,find_match_sync};