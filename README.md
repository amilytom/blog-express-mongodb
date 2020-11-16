# blog-express-mongodb

**博客系统前台程序（node+express+MongoDB）后端渲染技术**

> 之前一直使用 express 搭配 mysql 数据库来开发网站。express+mysql 的网站一连做了好几个，应该算是掌握了。

> 最近看了介绍 MongoDB 的书，感觉 MongoDB 跟 Mysql 有很大的区别。
> 就想着使用 mongodb 数据库做一个简单的网站来尝试一下，于是就有了 blog-express-mongodb 这个项目，以便加深了解。

> 之前多数网站都采用前后端分离，有专门的程序来生成 REST-API，所以可以看到一个网站有 API，afterend 和 frontend。有的甚至还有微信端。

> 本次就不搞这么复杂，不专门搞 API，也不开发后台，采用 ejs 模板引擎把从数据库读取的数据直接渲染到页面上。

> 通过 vue 调用 api 将数据渲染到页面上，称为前端渲染。通过 ejs 模板引擎来渲染页面，称为后端渲染。

## 项目使用以下技术栈

- async 异步处理方法库
- mongoose 数据库支持
- formidable 文件上传模块
- connect-multiparty 文件上传模块
- ejs 模板引擎
- ueditor 富文本编辑器
- express-session session
- nodemon node 运行自动化监控工具
- ApiPost API 文档生成工具

## 项目运行

下载项目文件夹后，先安装 node.js 和 MongoDB，创建所需的数据库 myblog 以及 admin 用户

之后安装依赖

```
npm install
```

然后

```
npm start
```

## 项目访问

修改默认端口 3000 为 3037

访问地址：http://127.0.0.1:3037
