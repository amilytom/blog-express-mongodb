const express = require("express");
const router = express.Router();

//文件上传
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

// 引入自定义的博客Controllers
const BlogController = require("../controllers/blog");

router.get("/", BlogController.blog1);

router.get("/user/login", BlogController.login);

router.get("/loginError", BlogController.loginError);

router.get("/user/reg", BlogController.reg);

router.all("/detail", multipartMiddleware, BlogController.detail);

router.all("/detail/Article", BlogController.readAll);

router.post("/fwNum", BlogController.fwNum);

module.exports = router;
