const { fetchContact } = require("../Controllers/Chatting/Chat");
let express = require("express");
const { isLogin } = require("../Controllers/auth");
let router = express.Router();
router.post("/chat/fetchcontact",isLogin,fetchContact);
module.exports = router;