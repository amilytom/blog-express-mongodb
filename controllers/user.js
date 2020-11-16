//引入文档模型
const UserModel = require("../models/user");

//配置对象
let exportObj = {
  user,
  userUpdate,
};

// 导出对象，供其它模块调用
module.exports = exportObj;

function user(req, res) {
  res.render("userCenter", {
    username: req.session.username,
    password: req.session.password,
    // imgUrl:imgUrl
  });
}

function userUpdate(req, res) {
  var query = { name: req.session.username };
  UserModel.update(
    query,
    { $set: { name: req.body.name, password: req.body.pwd } },
    function (err, docs) {
      req.session.username = req.body.name;
      res.send("修改成功！返回到<a href='/blog/detail'>微博首页</a>");
    }
  );
}
