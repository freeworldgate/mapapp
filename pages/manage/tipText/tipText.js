// pages/pk/invite/invite.js
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

    tips: [],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.hideShareMenu({
      complete: (res) => {},
    })
    that.setData({type:options.type})
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryTipText, "GET", {type:options.type});
    
  },
  





  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   var that = this;

  //     if(that.data.pkEnd){return;}
  //     var httpClient = template.createHttpClient(that);
  //     httpClient.setMode("label", true);
  //     httpClient.addHandler("success", function (tips) {
  //       that.setData({
  //           page:that.data.page + 1,
  //           tips:that.data.pks.concat(tips)
  //       })
  //     })
  //     httpClient.send(request.url.moreTips, "GET",{page:that.data.page});
    
  // },



  init:function (tab) {
    var that = this;
    that.queryPks(tab);
 
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryPks("label");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  login:function(){
    login.getUser(function(user){})    
  },
  

  upload:function (index) {
    var that = this;
    template.createEditTextDialog(that).show("添加Tip", "编辑Tip","", 500, function (tip) {
        
      // , urls
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (tip) {
        that.data.tips.push(tip); 
        that.setData({
          tips: that.data.tips,
        })
      })
      httpClient.send(request.url.addTextTip, "GET",{tip:tip,type:that.data.type});
  



});



  },

  removeImg:function(res)
  {
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("删除Tip","确定删除Tip?",function(){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (k) {
          that.data.tips.splice(index, 1); 
          that.setData({
            tips: that.data.tips,
          })
      })
      httpClient.send(request.url.removeTextTip , "GET",{id:id});

    },function(){});
  
  
  },


  
})