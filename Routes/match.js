let {match_people}= require("../Controllers/Match_Making/match.js");
var express = require("express");
const router = express.Router();
router.post("/post/match",match_people);
module.exports = router;