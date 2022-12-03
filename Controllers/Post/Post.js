var mongoose = require("mongoose");
var http = require("http");
const {Post} = require("../../Models/Post/Post");
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
    Post.findOneAndUpdate({_id:postid},{$inc : {'likes_count' : 1}, $push: { liked_by : id }},(err,post) => 
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