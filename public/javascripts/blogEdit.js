/**
 * Created by xuwk on 2016/12/22.
 */
$(function () {
  $("#myTab a:first").tab("show"); //初始化显示哪个tab

  $("#myTab a").click(function (e) {
    e.preventDefault(); //阻止a链接的跳转行为
    $(this).tab("show"); //显示当前选中的链接及关联的content
  });

  //文章管理 选择分类时的弹出框
  $("[data-toggle='popover']").popover();

  //富文本编辑器操作
  //上传博客内容
  $("#context").click(function () {
    $.ajax({
      type: "post",
      url: "/blogEdits",
      data: {
        role: "2",
        cat: $("#blog_cat").val(),
        title: $("#blog_title").val(),
        con_text: getContent(),
        text: getContentTxt(),
        data: new Date().toLocaleString().replace(/:\d{1,2}$/, " "),
      }, //利用getContent()获取到的内容，传给name="con_text",提交到数据库里
      success: function (msg) {
        if (msg.msg == 1) {
          window.location.href = "/blog/detail";
        }
      },
    });
    return false;
    //            alert(new Date().toLocaleString().replace(/:\d{1,2}$/,' '))
  });

  //修改博客内容
  $("#context_update").click(function () {
    $.ajax({
      type: "post",
      url: "/blogEdits",
      data: {
        role: "7",
        cat: $("#blog_cat").val(),
        title: $("#blog_title").val(),
        con_text: getContent(),
        text: getContentTxt(),
      },
      success: function (msg) {
        if (msg.msg == 1) {
          window.location.href = "/blog/detail";
        }
      },
    });
    return false;
    //            alert(new Date().toLocaleString().replace(/:\d{1,2}$/,' '))
  });

  //文章管理表格操作
  $(".removeTr").click(function () {
    var tr = $(this).parent().parent();
    tr.remove();
    $.ajax({
      type: "post",
      url: "/blogEdits",
      data: {
        role: "3",
        cat: tr.find(".catTd").html(),
        title: tr.find(".titleTd").text(),
      },
      success: function (msg) {
        if (msg.msg == 1) {
        }
      },
    });
  });

  function isFocus(e) {
    alert(UE.getEditor("editor").isFocus());
    UE.dom.domUtils.preventDefault(e);
  }
  function setblur(e) {
    UE.getEditor("editor").blur();
    UE.dom.domUtils.preventDefault(e);
  }
  function insertHtml() {
    var value = prompt("插入html代码", "");
    UE.getEditor("editor").execCommand("insertHtml", value);
  }
  function createEditor() {
    enableBtn();
    UE.getEditor("editor");
  }
  function getAllHtml() {
    alert(UE.getEditor("editor").getAllHtml());
  }
  function getContent() {
    //其中这个能获取内容包括HTML标签
    var arr = [];
    // arr.push("使用editor.getContent()方法可以获得编辑器的内容");
    // arr.push("内容为：");
    arr.push(UE.getEditor("editor").getContent());
    // alert(arr.join("\n"));
    return arr;
  }
  function getPlainTxt() {
    var arr = [];
    arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
    arr.push("内容为：");
    arr.push(UE.getEditor("editor").getPlainTxt());
    alert(arr.join("\n"));
  }
  function setContent(isAppendTo) {
    var arr = [];
    arr.push(
      "使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容"
    );
    UE.getEditor("editor").setContent("欢迎使用ueditor", isAppendTo);
    alert(arr.join("\n"));
  }
  function setDisabled() {
    UE.getEditor("editor").setDisabled("fullscreen");
    disableBtn("enable");
  }

  function setEnabled() {
    UE.getEditor("editor").setEnabled();
    enableBtn();
  }

  function getText() {
    //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
    var range = UE.getEditor("editor").selection.getRange();
    range.select();
    var txt = UE.getEditor("editor").selection.getText();
    alert(txt);
  }

  function getContentTxt() {
    var arr = [];
    // arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
    // arr.push("编辑器的纯文本内容为：");
    arr.push(UE.getEditor("editor").getContentTxt());
    return arr;
  }
  function hasContent() {
    var arr = [];
    arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
    arr.push("判断结果为：");
    arr.push(UE.getEditor("editor").hasContents());
    alert(arr.join("\n"));
  }
  function setFocus() {
    UE.getEditor("editor").focus();
  }
  function deleteEditor() {
    disableBtn();
    UE.getEditor("editor").destroy();
  }
  function disableBtn(str) {
    var div = document.getElementById("btns");
    var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
    for (var i = 0, btn; (btn = btns[i++]); ) {
      if (btn.id == str) {
        UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
      } else {
        btn.setAttribute("disabled", "true");
      }
    }
  }
  function enableBtn() {
    var div = document.getElementById("btns");
    var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
    for (var i = 0, btn; (btn = btns[i++]); ) {
      UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
    }
  }

  function getLocalData() {
    alert(UE.getEditor("editor").execCommand("getlocaldata"));
  }

  function clearLocalData() {
    UE.getEditor("editor").execCommand("clearlocaldata");
    alert("已清空草稿箱");
  }
});
