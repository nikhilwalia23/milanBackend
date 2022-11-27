let express = require("express");
const { getUserDeatails } = require("../Controllers/User/user");
let router = express.Router();
router.post("/user/getdetailsforchat",getUserDeatails);
module.exports = router;