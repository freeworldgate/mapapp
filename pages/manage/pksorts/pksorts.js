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
    albumType:0,
    pks: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
  })
    that.init("label");
  },
  queryInvites:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.addHandler("success", function (pks) {
      that.setData({
          pks:pks,
          page:1,
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
    httpClient.send(request.url.querySort, "GET", {});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.pkEnd){return;}
      var user = wx.getStorageSync('user');
      var fromUser = wx.getStorageSync('fromUser')
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", false);
      httpClient.addHandler("success", function (pagePks) {
        that.setData({
            page:that.data.page + 1,
            pks:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.nextSortPage, "GET",{ userId:user.userId ,page:that.data.page});
    
  },

  init:function (tab) {
    var that = this;
    that.queryInvites(tab);
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryInvites("label");
  },

  // addToPreHome:function(res)
  // {


  //     var that = this;
  //     var pkid = res.currentTarget.dataset.pkid;
      
  //     var index = res.currentTarget.dataset.index;
  //     template.createEditNumberDialog(that).show("设置优先级", 20,"", function (value) {
  //       var httpClient = template.createHttpClient(that);
  //       httpClient.setMode("label", true);
  //       httpClient.addHandler("success", function (pk) {
  //         that.data.pks.splice(index, 1,pk); 
  //         that.setData({
  //           pks: that.data.pks
  //         })

  //       })
  //       httpClient.send(request.url.addToPreHome, "GET",{pkId:pkid,value:value});

  //   },function(){});

  // },

  
  addToNonGeneticHome:function(res)
  {


      var that = this;
      var pkid = res.currentTarget.dataset.pkid;
      var index = res.currentTarget.dataset.index;
      template.createEditNumberDialog(that).show("设置非 VIP 主页优先级", 20,"", function (value) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (pk) {
          that.data.pks.splice(index, 1,pk); 
          that.setData({
            pks: that.data.pks
          })

        })
        httpClient.send(request.url.addToNonGeneticHome, "GET",{pkId:pkid,value:value});

    },function(){});

  },

  addToGeneticHome:function(res)
  {


      var that = this;
      var pkid = res.currentTarget.dataset.pkid;
      var index = res.currentTarget.dataset.index;
      template.createEditNumberDialog(that).show("设置 VIP 主页优先级", 20,"", function (value) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (pk) {
          that.data.pks.splice(index, 1,pk); 
          that.setData({
            pks: that.data.pks
          })

        })
        httpClient.send(request.url.addToGeneticHome, "GET",{pkId:pkid,value:value});

    },function(){});

  },

  albumType:function(res)
  {
    var that = this;
    var type = res.currentTarget.dataset.type;
    that.setData({
      albumType: parseInt(type)
    })

  },



  pkDetail:function (params) {
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=PK01',
    })
  },
  viewPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=' + pkid,
    })

  },
  groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;


    wx.navigateTo({
      url: '/pages/pk/message/message?pkId=' + pkId + '&type=1',
    })


    // var httpClient = template.createHttpClient(that);
    // httpClient.setMode("label", true);
    // httpClient.send(request.url.viewGroupCode, "GET",{pkId:pkId});   

    // uploadInnerPublicGroupCode

  },
  approverMessageDetail:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    login.getUser(function (user) {

      wx.navigateTo({
        url: '/pages/pk/messageInfo/messageInfo?pkId=' + pkId ,
      })   
    })


  },
})