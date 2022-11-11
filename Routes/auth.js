var express=require("express");
const { login,singUp,isLogin, welcome, forgetPassword, ressetPassword } = require("../Controllers/auth");
const router = express.Router()
router.post("/singup",singUp);
router.post("/login",login);
router.get("/check",isLogin,welcome);
router.post("/forgetPassword",forgetPassword);
router.post("/resetPassowr",ressetPassword);
module.exports = router;