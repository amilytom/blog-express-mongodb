//引入mongoose
//const mongoose = require("mongoose");
const mongoose = require("./dbconfig");

//创建Schema（模型对象）
const Schema = mongoose.Schema;

//基于scheme结构定义数据模型
const UserSchema = new Schema({
  name: String,
  password: String,
  pic: String,
});

//构建model
const User = mongoose.model("user", UserSchema);

//module.exports = UserModel;

module.exports = User;
