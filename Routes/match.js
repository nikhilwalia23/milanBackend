let {match_people,find_match,find_match_sync}= require("../Controllers/Match_Making/match.js");
var express = require("express");
const { isLogin } = require("../Controllers/auth.js");
const router = express.Router();
router.post("/post/match",isLogin,match_people);
router.post("/post/find_match",isLogin,find_match_sync);
module.exports = router;