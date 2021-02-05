// pages/manage/setting/setting.js
var request = require('./../../../utils/request.js')
var http = require('./../../../utils/http.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
var route = require('./../../../utils/route.js')
var redirect = require('./../../../utils/redirect.js')
var uuid = require('./../../../utils/uuid.js')
var inviteReq = require('./../../../utils/invite.js')
var userInvite = require('./../../../utils/userInvite.js')
var upload = require('./../../../utils/uploadFile.js')
var template = require('./../../../template/template.js')




Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.querySystemSetting, "GET",{});

  },

  setmode:function (res) {
    var that = this;
    var type = res.currentTarget.dataset.type;
    var value = res.detail.value;

        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.send(request.url.systemSetting, "GET",{type:type,value:value});
      




  },
  setStr:function (res) {
    var that = this;
    var type = res.currentTarget.dataset.type;



      template.createEditNumberDialog(that).show("设置数据", 100,"", function (value) {

        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.send(request.url.systemSetting, "GET",{type:type,value:value});
      });


  },
  setStrValue:function (res) {
    var that = this;
    var type = res.currentTarget.dataset.type;



      template.createShortTextDialog(that).show("编辑", 200,"", function (value) {

        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.send(request.url.systemSetting, "GET",{type:type,value:value});
      });


  },
  setBoolean:function (res) {
    var that = this;
    var type = res.currentTarget.dataset.type;
    var value = res.currentTarget.dataset.value;

 
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.send(request.url.systemSetting, "GET",{type:type,value:value==='true'?'false':'true'});


  },



  set:function (res) {
    var that = this;

    var type = res.currentTarget.dataset.type;
    var value = res.currentTarget.dataset.value;

 
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.systemSetting, "GET",{type:type,value:value});
  









  }




})