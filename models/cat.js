//引入mongoose
//const mongoose = require("mongoose");
const mongoose = require("./dbconfig");
//创建Schema（模型对象）
const Schema = mongoose.Schema;

//基于scheme结构定义数据模型
const CatSchema = new Schema({
  name: String,
  catname: String,
});

//构建model
const Cat = mongoose.model("cat", CatSchema);

//module.exports = CatModel;
module.exports = Cat;
