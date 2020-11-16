//引入文档模型
const UserModel = require("../models/user");
const CatModel = require("../models/cat");
const ContentModel = require("../models/content");

//文件上传模块
//const formidable = require("formidable");

//异步处理方法库
const async = require("async");

//配置对象
let exportObj = {
  login,
  loginError,
  reg,
  blog1,
  detail,
  readAll,
  fwNum,
};

//导出对象,供其它模块调用
module.exports = exportObj;

function login(req, res) {
  res.render("login", {});
}

function loginError(req, res) {
  res.render("loginError", {});
}

function reg(req, res) {
  res.render("reg", {});
}

function blog1(req, res) {
  let imgur2 = "";
  async.parallel(
    {
      //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
      getContentAll: function (callback) {
        ContentModel.find(function (err, docs) {
          if (err) {
            res.render("error");
          } else {
            callback(null, docs);
          }
        });
      },
      getContentByClick: function (callback) {
        ContentModel.find({})
          .sort({ click: -1 })
          .limit(5)
          .exec(function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          });
      },
      getImgUrl: function (callback) {
        if (req.session.username) {
          UserModel.find({ name: req.session.username }, function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              if (docs[0]["pic"] == "") {
                imgur2 = "/images/touxiang/Koala.jpg";
              } else {
                imgur2 = urlHandle(docs[0]["pic"]);
              }
              callback(null, imgur2);
            }
          });
        } else {
          callback(null, "00");
        }
      },
    },
    function (err, results) {
      res.render("blog", {
        title: "博客首页",
        userSession: req.session.username,
        contentsAll: results["getContentAll"],
        contents: results["getContent"],
        imgUrl: results["getImgUrl"],
        contentsByClick: results["getContentByClick"],
      });
    }
  );
}

function detail(req, res) {
  if (req.body.sRole == 1) {
    //处理注册
    var query1 = { name: req.body.user, password: req.body.password };
    var entity = new UserModel({
      name: query1.name,
      password: req.body.password,
      pic: "",
    });
    entity.save();
    var entity2 = new CatModel({ name: query1.name, catname: "默认分类" });
    entity2.save();
    req.session.username = query1.name;
    req.session.password = query1.password;
    req.session.imgURl = "/images/touxiang/Koala.jpg";
    async.parallel(
      {
        //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
        getContentAll: function (callback) {
          ContentModel.find(function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              // console.log(docs)
              callback(null, docs);
            }
          });
        },
        getContent: function (callback) {
          ContentModel.find({ name: req.session.username }, function (
            err,
            docs
          ) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          });
        },
        getContentByClick: function (callback) {
          ContentModel.find({})
            .sort({ click: -1 })
            .limit(5)
            .exec(function (err, docs) {
              if (err) {
                res.render("error");
              } else {
                callback(null, docs);
              }
            });
        },
      },
      function (err, results) {
        res.render("detail", {
          title: "博客详细页",
          username: query1.name,
          userSession: req.session.username,
          imgUrl: "/images/touxiang/Koala.jpg",
          contentsAll: results["getContentAll"],
          contents: results["getContent"],
          contentsByClick: results["getContentByClick"],
          date: new Date(),
        });
      }
    );
  } else if (req.body.sRole == 2) {
    //处理ajax（用户名是否注册过）
    var query2 = { name: req.body.name };
    UserModel.find(query2, function (err, docs) {
      if (err) {
        res.render("error");
      } else {
        if (docs.length == 1) {
          res.json({ msg: 1 });
        } else {
          res.json({ msg: 0 });
        }
      }
    });
  } else if (req.body.sRole == 3) {
    //处理登录
    var imgur2 = "";
    var query3 = { name: req.body.user, password: req.body.password };
    async.parallel(
      {
        //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
        getContentAll: function (callback) {
          ContentModel.find(function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          });
        },
        getContent: function (callback) {
          ContentModel.find({ name: query3.name }, function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          });
        },
        getImgUrl: function (callback) {
          UserModel.find(query3, function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              if (docs.length == 0) {
                res.redirect("/loginError");
              } else {
                if (docs[0]["pic"] == "") {
                  imgur2 = "/images/touxiang/Koala.jpg";
                } else {
                  imgur2 = urlHandle(docs[0]["pic"]);
                }
                req.session.username = query3.name;
                req.session.password = query3.password;
                req.session.imgURl = imgur2;
                callback(null, imgur2);
              }
            }
          });
        },
        getContentByClick: function (callback) {
          ContentModel.find({})
            .sort({ click: -1 })
            .limit(5)
            .exec(function (err, docs) {
              if (err) {
                res.render("error");
              } else {
                callback(null, docs);
              }
            });
        },
      },
      function (err, results) {
        console.log(results["getContentByClick"]);
        res.render("detail", {
          title: "博客详细页",
          username: query3.name,
          userSession: req.session.username,
          imgUrl: results["getImgUrl"],
          contentsAll: results["getContentAll"],
          contents: results["getContent"],
          contentsByClick: results["getContentByClick"],
          date: new Date(),
        });
      }
    );
  } else if (req.body.sRole == 4) {
    var imgurl3 = "";
    //处理头像上传
    var query4 = { name: req.session.username };
    var file = req.files.pic;
    var path = file.path;
    //存储路径
    UserModel.update(query4, { $set: { pic: path } }, function (err, docs) {});
    if (path == "") {
      imgurl3 = "/images/touxiang/Koala.jpg";
    } else {
      imgurl3 = urlHandle(path);
    }
    req.session.imgURl = imgurl3;

    async.parallel(
      {
        //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
        getContentAll: function (callback) {
          ContentModel.find(function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          });
        },
        getContent: function (callback) {
          ContentModel.find({ name: query4.name }, function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          });
        },
        getContentByClick: function (callback) {
          ContentModel.find({})
            .sort({ click: -1 })
            .limit(5)
            .exec(function (err, docs) {
              if (err) {
                res.render("error");
              } else {
                callback(null, docs);
              }
            });
        },
      },
      function (err, results) {
        res.render("detail", {
          title: "博客详细页",
          username: query4.name,
          userSession: req.session.username,
          contentsAll: results["getContentAll"],
          contents: results["getContent"],
          contentsByClick: results["getContentByClick"],
          imgUrl: imgurl3,
          date: new Date(),
        });
      }
    );
  } else {
    var imgurl4 = "";
    var query5 = { name: req.session.username };
    async.parallel(
      {
        //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
        getContentAll: function (callback) {
          ContentModel.find(function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              // console.log(docs)
              callback(null, docs);
            }
          });
        },
        getContent: function (callback) {
          ContentModel.find({ name: query5.name }, function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              callback(null, docs);
            }
          });
        },
        getImgUrl: function (callback) {
          UserModel.find(query5, function (err, docs) {
            if (err) {
              res.render("error");
            } else {
              if (docs.length == 0) {
                res.redirect("/loginError");
              } else {
                if (docs[0]["pic"] == "") {
                  imgurl4 = "/images/touxiang/Koala.jpg";
                } else {
                  imgurl4 = urlHandle(docs[0]["pic"]);
                }
                req.session.username = query5.name;
                req.session.password = query5.password;
                callback(null, imgurl4);
              }
            }
          });
        },
        getContentByClick: function (callback) {
          ContentModel.find({})
            .sort({ click: -1 })
            .limit(5)
            .exec(function (err, docs) {
              if (err) {
                res.render("error");
              } else {
                callback(null, docs);
              }
            });
        },
      },
      function (err, results) {
        res.render("detail", {
          title: "博客详细页",
          username: query5.name,
          userSession: req.session.username,
          imgUrl: results["getImgUrl"],
          contentsAll: results["getContentAll"],
          contents: results["getContent"],
          contentsByClick: results["getContentByClick"],
          date: new Date(),
        });
      }
    );
  }
}

function readAll(req, res) {
  var imgurl4 = "";
  var query5 = { name: req.query.name };
  async.parallel(
    {
      //parallel函数是并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
      getContent: function (callback) {
        ContentModel.find(
          { name: req.query.name, title: req.query.title.toString() },
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
        //获取登陆头像
        UserModel.find({ name: req.session.username }, function (err, docs) {
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
            }
            callback(null, imgurl4);
          }
        });
      },
      getImgUrl2: function (callback) {
        //获取博客作者头像
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
            }
            callback(null, imgurl4);
          }
        });
      },
      getCats: function (callback) {
        CatModel.find(query5, function (err, docs) {
          if (err) {
            res.render("error");
          } else {
            callback(null, docs);
          }
        });
      },
      getCatsNum: function (callback) {
        CatModel.find({ name: req.query.name }, function (err, docs) {
          if (err) {
            res.render("error");
          } else {
            var catsNum = {},
              result2 = [];
            async.mapSeries(
              docs,
              function (dd, callback1) {
                ContentModel.find(
                  { name: req.query.name, cat: dd["catname"] },
                  function (err, docs) {
                    catsNum[dd["catname"]] = docs.length;
                    callback1(null, catsNum);
                  }
                );
              },
              function (err, results) {
                result2 = results;
                callback(null, result2);
              }
            );
          }
        });
      },
    },
    function (err, results) {
      res.render("readAll", {
        title: "博客内容页单页",
        username: query5.name,
        userSession: req.session.username,
        imgUrl: results["getImgUrl"],
        imgUrl2: results["getImgUrl2"],
        contents: results["getContent"],
        cats: results["getCats"],
        catsNum: results["getCatsNum"],
        date: new Date(),
      });
    }
  );
}

function fwNum(req, res) {
  var query = { name: req.body.name, title: req.body.title };
  async.waterfall(
    [
      function (callback) {
        ContentModel.find(query, function (err, docs) {
          docs[0]["click"]++;
          callback(null, docs[0]["click"]);
        });
      },
      function (num, callback) {
        // console.log(num)
        ContentModel.update(query, { $set: { click: num } }, function (
          err,
          docs
        ) {
          //console.log(docs)
        });
        callback(null, num);
      },
    ],
    function (err, result) {
      res.json({ msg: result });
    }
  );
}

function urlHandle(url) {
  const str = url.replace(/\\/g, "/");
  return str.replace(/public/g, "");
}
