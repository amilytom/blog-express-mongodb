var express = require("express");
var router = express.Router();

// 引入自定义的博客Controllers
const UserController = require("../controllers/user");

router.get("/blog/user", UserController.user);

router.post("/blog/user", UserController.userUpdate);

module.exports = router;
