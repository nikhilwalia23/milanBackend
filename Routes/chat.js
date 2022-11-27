const { fetchContact } = require("../Controllers/Chatting/Chat");
let express = require("express");
let router = express.Router();
router.post("/chat/fetchcontact",fetchContact);
module.exports = router;