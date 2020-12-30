// pages/pk/selectPker/selectPker.js

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
  data: 
  {
    activeCode:"",
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.hideShareMenu({
        complete: (res) => {},
      })
      var that = this;
      inviteReq.getHeight(function (res) {
        that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
      })


      var pkId = options.pkId;
      this.setData({pkId:pkId})
      this.queryPkApprove(pkId);






  },

  queryPkApprove:function (pkId) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryPkApprove, "GET",{ pkId:pkId});
  




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
  groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.viewGroupCode, "GET",{pkId:pkId});   

  },
  selectCashier:function (res) {
    var that = this;
    var cashier = res.currentTarget.dataset.cashier;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
      that.setData({
        selectCashier:cashier
      })
    })
    httpClient.send(request.url.selectCashier, "GET",{pkId:that.data.pkId});   










  },
  activeAgine:function(res)
  {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.activeAgine, "GET",{pkId:pkId});   



  },
  activeGroupCode:function(res) {
    var that = this;
    var cashierId = res.currentTarget.dataset.cashierid;
    var pkId = res.currentTarget.dataset.pkid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    
    httpClient.addHandler("selectCashier", function (tip) {
      template.createOperateDialog(that).show("选择激活群", "确定选择，不能修改...", function () {
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.send(request.url.confirmSelectCashier, "GET",{cashierId:cashierId,pkId:pkId});   

    }, function () {});
    })



    httpClient.send(request.url.viewActiveGroupCode, "GET",{cashierId:cashierId,pkId:pkId});   

  },


  back:function(){wx.navigateBack({
    complete: (res) => {},
  })},

  inputActiveCode:function(res){
    var that = this;
    var value = res.detail.value;
    that.setData({
      activeCode: value,
    })
  },


  activePK:function(res)
  {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.activeSinglePK, "GET",{pkId:that.data.pkId,activeCode:that.data.activeCode});   



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})