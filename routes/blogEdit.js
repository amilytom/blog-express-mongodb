var express = require("express");
var router = express.Router();

const BlogEditController = require("../controllers/blogEdit");

router.get("/blogEdits", BlogEditController.blog_edit);

router.post("/blogEdits", BlogEditController.blog_updateBlog);

router.get("/blog/detail/Update", BlogEditController.updateC);

module.exports = router;
