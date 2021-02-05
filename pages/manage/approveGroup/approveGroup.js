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


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApprovingGroups, "GET", {});

  },














  onReachBottom:function(){
    if(!this.data.nomore)
    {
      this.nextPage();
    }


  },
  nextPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.groups.concat(data);
      that.setData({
        groups: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextApprovingGroups, "GET", {  page: that.data.page });

    // wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){

  },


  openText:function(res)
  {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var tag = 'findUsers['+index+'].tag';
    var ctag = that.data.findUsers[index].tag;
    that.setData({
      [tag]:!ctag
    })
  },
  approvePass:function(res){
    var that = this;
    var group = res.currentTarget.dataset.group;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (singlegroup) {
      var key = "groups["+index+"]";
      that.setData({
        [key] : singlegroup,
      });
    })
    httpClient.send(request.url.passGroup, "GET", {groupId:group.groupId});


  }










})