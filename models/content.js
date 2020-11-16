//引入mongoose
//const mongoose = require("mongoose");
const mongoose = require("./dbconfig");

//创建Schema（模型对象）
const Schema = mongoose.Schema;

//基于scheme结构定义数据模型
const ContentSchema = new Schema({
  name: String,
  title: String,
  titlePic: String,
  text: String,
  content: String,
  time: String,
  cat: String,
  click: Number,
});

//构建model
const Content = mongoose.model("content", ContentSchema);

module.exports = Content;
