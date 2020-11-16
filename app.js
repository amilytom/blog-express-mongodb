const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const logger = require("morgan");
const session = require("express-session");
//var bodyParser = require("body-parser");
const ueditor = require("ueditor");

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const blogEditRouter = require("./routes/blogEdit");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//使用ueditor
app.use(
  "/ueditor",
  ueditor(path.join(__dirname, "public"), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    console.log(".....................................");
    if (req.query.action === "uploadimage") {
      // 这里你可以获得上传图片的信息
      var foo = req.ueditor;
      // console.log(foo.filename); // exp.png
      // console.log(foo.encoding); // 7bit
      // console.log(foo.mimetype); // image/png
      var imgname = req.ueditor.filename;

      // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
      var img_url = "/images/ueditor/";
      res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
      res.setHeader("Content-Type", "text/html");
    }
    //  客户端发起图片列表请求
    else if (req.query.action === "listimage") {
      var dir_url = "/images/ueditor/"; // 要展示给客户端的文件夹路径
      res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
      res.setHeader("Content-Type", "application/json");
      // 这里填写 ueditor.config.json 这个文件的路径
      res.redirect("/ueditor/nodejs/config.json");
    }
  })
);

app.use(multipart({ uploadDir: "public/images/touxiang" }));
app.use(
  session({
    secret: "12345",
    cookie: {
      secret: true,
      expires: false,
    },
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/blog", blogRouter);
app.use("/", blogEditRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
