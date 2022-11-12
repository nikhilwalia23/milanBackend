var express=require("express");
const { isLogin } = require("../Controllers/auth");
const {createPost, showAllpost, likePost, dislikePost} = require("../Controllers/Post/Post");
const router = express.Router();
router.post("/post/create",isLogin,createPost);
router.post("/post/show",isLogin,showAllpost);
router.post("/post/like",isLogin,likePost);
router.post("/post/dislike",isLogin,dislikePost);
module.exports = router;