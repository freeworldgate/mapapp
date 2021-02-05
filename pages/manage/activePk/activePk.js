// pages/pk/pk/pk.js
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
    pks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.activePks, "GET", {});

  },

  activePk:function (res) {

    var that = this;
    var pk = res.currentTarget.dataset.pk;
    var index = res.currentTarget.dataset.index;


    template.createOperateDialog(that).show("激活", "确定激活主题吗?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
            that.data.pks.splice(index, 1); 
            that.setData({
              pks: that.data.pks
            })
      })
      httpClient.send(request.url.activePk, "GET", {pkId:pk.pk.pkId});
  
    }, function () { });






  },
    groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/message/message?pkId=' + pkId + "&type=1",
    })

  },
  view:function(res){

    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })

  },
  hiddenPk:function (res) {
    var that = this;
    var pk = res.currentTarget.dataset.pk;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("驳回", "确定驳回主题吗?", function () {

      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
          that.data.pks.splice(index, 1); 
          that.setData({
            pks:that.data.pks
          })
      })
      httpClient.send(request.url.hiddenPk, "GET",  {pkId:pk.pk.pkId,tipId:that.data.tipId});
    }, function () { });









  },


  



  onPullDownRefresh:function(){
    this.refreshPage();
  },

  refreshPage: function () {
    var that = this;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.manageApprovingPosts, "GET", {});

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
  selectTip:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    that.setData({
      tipId:id
    })




  }




})