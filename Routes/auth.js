var express=require("express");
const { login,singUp,isLogin, welcome, forgetPassword, ressetPassword } = require("../Controllers/auth");
const router = express.Router()
router.post("/singup",singUp);
module.exports = router;