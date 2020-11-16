//引入文档模型
const UserModel = require("../models/user");
const CatModel = require("../models/cat");
const ContentModel = require("../models/content");

//文件上传模块
const formidable = require("formidable");

//异步处理方法库
const async = require("async");

//配置对象
let exportObj = {
  blog_edit,
  blog_updateBlog,
  updateC,
};

// 导出对象，供其它模块调用
module.exports = exportObj;

function blog_edit(req, res) {
  //查找文章类别
  async.parallel(
    {
      //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
      getCat: function (callback) {
        var blog_cats = [];
        CatModel.find({ name: req.session.username }, function (err, docs) {
          if (err) {
            res.render("error");
          } else {
            for (var i = 0; i < docs.length; i++) {
              blog_cats.push(docs[i].catname);
            }
            callback(null, blog_cats);
          }
        });
      },
      getContent: function (callback) {
        ContentModel.find({ name: req.session.username }, function (err, docs) {
          if (err) {
            res.render("error");
          } else {
            callback(null, docs);
          }
        });
      },
      getCatsNum: function (callback) {
        CatModel.find({ name: req.session.username }, function (err, docs) {
          if (err) {
            res.render("error");
          } else {
            var catsNum = {},
              result2 = [];
            // console.log(docs);
            async.mapSeries(
              docs,
              function (dd, callback1) {
                // console.log("dd is"+dd)
                // console.log("catname is"+dd['catname']);
                ContentModel.find(
                  { name: req.session.username, cat: dd["catname"] },
                  function (err, rs) {
                    catsNum[dd["catname"]] = rs.length;
                    // console.log(catsNum)
                    callback1(null, catsNum);
                  }
                );
              },
              function (err, results) {
                result2 = results;
                // console.log(result2)
                callback(null, result2);
              }
            );
          }
        });
      },
    },
    function (err, results) {
      // console.log(results['getCatsNum']+"000000000")
      res.render("blogEdits", {
        title: "博客编辑页",
        username: req.session.username,
        userSession: req.session.username,
        imgUrl: req.session.imgURl,
        date: new Date(),
        cats: results["getCat"],
        content: results["getContent"],
        catsNum: results["getCatsNum"],
      });
    }
  );
}

function blog_updateBlog(req, res) {
  console.log(req.body);
  //上传内容
  if (req.body.role == 1) {
    //销毁session
    req.session.username = null;
    res.json({ msg: 1 });
  } else if (req.body.role == 2) {
    //上传博客内容
    var titlePic = "";

    var con = req.body.con_text;
    //匹配图片（g表示匹配所有结果i表示区分大小写）
    var imgReg = /<img.*?(?:>|\/>)/gi;
    //匹配src属性
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = con[0].match(imgReg);
    if (arr == null) {
      titlePic = "/images/ex02.jpg";
    } else {
      titlePic = arr[0].match(srcReg)[1];
    }

    var [textstr] = req.body.text;
    var [context] = req.body.con_text;
    var entity = new ContentModel({
      name: req.session.username,
      title: req.body.title,
      titlePic: titlePic,
      text: textstr,
      content: context,
      time: req.body.data,
      cat: req.body.cat,
      click: 0,
    });
    console.log(entity);
    entity.save();
    res.json({ msg: 1 });
    // console.log(req.body.con_text)
  } else if (req.body.role == 3) {
    //删除博客
    var query = {
      name: req.session.username,
      title: req.body.title,
      cat: req.body.cat,
    };
    ContentModel.remove(query, function (err, docs) {
      res.json({ msg: 1 });
    });
  } else if (req.body.role == 4) {
    //更新分类
    var query1 = { name: req.session.username, catname: req.body.catNameOld };

    // console.log(req.body.catNameOld+","+req.body.catNameNew)
    CatModel.update(
      query1,
      { $set: { catname: req.body.catNameNew } },
      function (err, docs) {
        if (err) {
          res.render("error");
        }
      }
    );
    var query2 = { name: req.session.username, cat: req.body.catNameOld };
    ContentModel.update(
      query2,
      { $set: { cat: req.body.catNameNew } },
      function (err, docs) {
        if (err) {
          res.render("error");
        }
      }
    );
    res.json({ msg: 1 });
  } else if (req.body.role == 5) {
    //上传分类
    var query = { name: req.session.username, catname: req.body.catsAdd };

    CatModel.find(query, function (err, docs) {
      //查找是否分类已经存在过
      if (docs.length != 0) {
        res.json({ msg: 0 });
      } else {
        var entity = new CatModel(query);
        entity.save();
        res.json({ msg: 1 });
      }
    });
  } else if (req.body.role == 6) {
    //获取初始化内容
    ContentModel.find(
      { name: req.session.username, title: req.body.title, cat: req.body.cat },
      function (err, docs) {
        if (err) {
          res.render("error");
        } else {
          res.json({ msg: docs });
        }
      }
    );
  } else if (req.body.role == 7) {
    //更新博客内容
    var titlePic = "";
    var con = req.body.con_text;
    //匹配图片（g表示匹配所有结果i表示区分大小写）
    var imgReg = /<img.*?(?:>|\/>)/gi;
    //匹配src属性
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = con[0].match(imgReg);
    if (arr == null) {
      titlePic = "/images/ex02.jpg";
    } else {
      titlePic = arr[0].match(srcReg)[1];
    }
    ContentModel.update(
      { name: req.session.username, title: req.body.title, cat: req.body.cat },
      {
        $set: {
          title: req.body.title,
          content: req.body.con_text,
          text: req.body.text,
          titlePic: titlePic,
        },
      },
      function (err, docs) {}
    );
    res.json({ msg: 1 });
  } else if (req.body.role == 8) {
    //收藏文章
  }
}

function updateC(req, res) {
  var imgurl4 = "";
  var query5 = { name: req.session.username };
  async.parallel(
    {
      //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
      getContent: function (callback) {
        ContentModel.find(
          {
            name: req.session.username,
            title: req.query.title,
            cat: req.query.cat,
          },
          function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          }
        );
      },
      getImgUrl: function (callback) {
        UserModel.find(query5, function (err, docs) {
          if (err) {
            res.render("error");
          } else {
            if (docs.length == 0) {
            } else {
              if (docs[0]["pic"] == "") {
                imgurl4 = "/images/touxiang/Koala.jpg";
              } else {
                imgurl4 = urlHandle(docs[0]["pic"]);
              }
              req.session.username = query5.name;
              req.session.password = query5.password;
            }
            callback(null, imgurl4);
          }
        });
      },
    },
    function (err, results) {
      res.render("blogUpdate", {
        title: "博客更新",
        username: query5.name,
        userSession: req.session.username,
        contents: results["getContent"],
        imgUrl: results["getImgUrl"],
      });
    }
  );
}

function urlHandle(url) {
  var str = url.replace(/\\/g, "/");
  return str.replace(/public/g, "");
}
