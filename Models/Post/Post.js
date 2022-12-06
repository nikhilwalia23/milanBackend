var mongoose = require("mongoose");
var ObjectId=mongoose.ObjectId;
const postSchema = new mongoose.Schema({
    post_text:
    {
        type: String,
    },
    post_owner:
    {
        type: String,
    },
    likes_count:
    {
        type: Number,
        default: 0
    },
    liked_by:[{ type : ObjectId, ref: 'User' }],
    post_img:
    {
        type: String
    },
    //Category Still Serching
    hindu:
    {
        type: Number,
        default: 50
    },
    muslim:
    {
        type: Number,
        default: 50
    },
    cricket:
    {
        type: Number,
        default: 50
    },
    football:
    {
        type:Number,
        default: 50
    },
    bjp:
    {
        type: Number,
        default: 50
    },
    congress:
    {
        type: Number,
        default: 50
    },
    open_minded:
    {
        type: Number,
        default: 50
    },
    feminism:
    {
        type: Number,
        default: 50
    },
    religious_liberals:
    {
        type: Number,
        default: 50
    }
    
},{ timestamps: true });
const Post = mongoose.model('Post',postSchema);
module.exports = {Post};