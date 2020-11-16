const express = require("express");
const router = express.Router();

// 引入自定义的博客Controllers
const IndexController = require("../controllers/index");

router.get("/", IndexController.index);

module.exports = router;
