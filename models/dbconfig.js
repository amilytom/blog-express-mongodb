//引入mongoose
const mongoose = require("mongoose");

//定义mongodb数据库连接
const url = "mongodb://admin:246810@127.0.0.1:27017/myblog?authSource=admin";

//mongoose连接mongodb数据
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//mongoose监控数据库连接
//成功连接
mongoose.connection.on("connected", function () {
  console.log("connecting...");
});

//连接成功后数据库操作发生错误
mongoose.connection.on("error", function (err) {
  console.log("connected err" + err);
});

//未成功连接
mongoose.connection.on("disconnected", function () {
  console.log("disconnected");
});

//使用process.on("SIGINT")监听进程事件
//mongoose关闭数据库通知进程退出
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("close");
    process.exit(0);
  });
});

module.exports = mongoose;
