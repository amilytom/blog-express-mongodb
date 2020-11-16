// 配置对象
let exportObj = {
  index,
};
// 导出对象，供其它模块调用
module.exports = exportObj;

function index(req, res) {
  res.render("index", { title: "博客首页", name: "博客网站" });
}
