// pages/pk/findSomeOne/findSomeOne.js
var request = require('./../../../utils/request.js')
var http = require('./../../../utils/http.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
var locationUtil = require('./../../../utils/locationUtil.js')
var route = require('./../../../utils/route.js')
var redirect = require('./../../../utils/redirect.js')
var uuid = require('./../../../utils/uuid.js')
var inviteReq = require('./../../../utils/invite.js')
var userInvite = require('./../../../utils/userInvite.js')
var upload = require('./../../../utils/uploadFile.js')
var template = require('./../../../template/template.js')
var amapFile = require('./../../../utils/amap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgUrl:'https://oss.211shopper.com/dir2/wx-1606375746086.jpg'

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

    login.getUser(function(user){
      that.setData({user:user})
    })
    that.setData({pkId:options.pkId})

    that.queryFinds("page",options.pkId);


  },
  queryFinds:function(page,pkId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(page, true);
    httpClient.send(request.url.queryPkFinds, "GET", { pkId: pkId});
  },

  onShareAppMessage:function(res){
    var that = this;
    var findId = res.target.dataset.findid;
    var url = res.target.dataset.url;
    var pkName = res.target.dataset.pkname;
    return {
        title: '遇见不撩 卡点互捞 @ ' + pkName ,
        desc: pkName,
        imageUrl:url,
        path: '/pages/pk/findCard/findCard?findId=' + findId,
    }

  }
})