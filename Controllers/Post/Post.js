var mongoose = require("mongoose");
var http = require("http");
const {Post} = require("../../Models/Post/Post");
const { User } = require("../../Models/User/User");
const { getUserDeatails } = require("../User/user");
var ObjectId=mongoose.ObjectId;
const createPost = (req,res) => 
{
    const post = new Post(req.body);
    post.save((err,post) => 
    {
        if(err)
        {
            return res.status(400).json(err);
        }
        else
        {
            return res.status(200).json(post);
        }
    })
}

const editPost = () =>
{

}

const showAllpost = (req,res) => 
{
    Post.find({},{},{sort:{ 'created_at' : -1 }}).limit(10).exec((err,post)=> 
    {
        if(err)
        {
            return res.status(400).json(err);
        }
        else
        {
            return res.status(200).json(post);
        }
    });
}

const viewPost = (req,res) => 
{
    
}

const likePost = (req,res) => 
{
    const {postid,id} = req.body;
    //Increate Count
    Post.findOneAndUpdate({_id:postid},{$inc : {'likes_count' : 1}, $push: { liked_by : id }},(err,post) => 
    {
        if(err)
        {
            return res.status(400).json(err);
        }
        else
        {
            //Push In Likes Array
            User.findByIdAndUpdate({_id:id},{$push:{likes:postid}},(err,user)=> 
            {
                if(err)
                {
                    return res.status(500).json(err);
                }
                else
                {
                    return res.status(200).json(user); 
                }
            });
        }
    });
}

const dislikePost = (req,res) => 
{
    const {postid,id} = req.body;
    Post.findOneAndUpdate({_id:postid},{$inc : {'likes_count' : -1}, $pull: { liked_by : id }},(err,post) => 
    {
        if(err)
        {
            return res.status(400).json(err);
        }
        else
        {
            return res.status(200).json(post);
        }
    });
}
module.exports = {createPost,editPost,showAllpost,dislikePost,likePost,viewPost};