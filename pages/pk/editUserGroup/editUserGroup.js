var request = require('../../../utils/request.js')
var http = require('../../../utils/http.js')
var tip = require('../../../utils/tipUtil.js')
var login = require('../../../utils/loginUtil.js')
var locationUtil = require('../../../utils/locationUtil.js')
var route = require('../../../utils/route.js')
var redirect = require('../../../utils/redirect.js')
var uuid = require('../../../utils/uuid.js')
var inviteReq = require('../../../utils/invite.js')
var userInvite = require('../../../utils/userInvite.js')
var upload = require('../../../utils/uploadFile.js')
var template = require('../../../template/template.js')
var amapFile = require('../../../utils/amap-wx.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userGroup:{}
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
    that.setData({
      pkId:options.pkId
    })
    that.queryUserFind(options.pkId,"page");
  },
  
  editName:function(){
    var that = this;
    if(that.data.userGroup.groupName){
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupName&text='+that.data.userGroup.groupName
      })
    }
    else
    {
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupName&text='
      })
    }


  },
  editDesc:function(){
    var that = this;
    if(that.data.userGroup.groupDesc){
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupDesc&text='+that.data.userGroup.groupDesc
      })
    }
    else
    {
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupDesc&text='
      })
    }


  },
  uploadImgs:function(){
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        var files = res.tempFilePaths;
        template.uploadImages3("PK-User-Back", files,that, function(urls){
            that.setData({
              'userGroup.groupCard':urls[0]?urls[0]:'',
            })
        }, function(){});
      },
    })


  },
  showPk:function(res){
    var that = this;
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('locationShow', pk)
    locationUtil.getLocation(function(latitude,longitude){

      var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
      that.setData({
        length:parseFloat(distance*1000),
        lengthStr:distance<1?distance*1000:distance
      })
    })
    wx.navigateTo({
      url: '/pages/pk/showLocation/showLocation',
    })

  },
  bindPickerChange:function(e){
    var that = this;
    if(that.data.findUser.statu && (that.data.findUser.statu.key === 1||that.data.findUser.statu.key === 2||that.data.findUser.statu.key === 3))
    {
      template.createOperateDialog(that).show("提示", "当前状态不支持修改",function(){
      },function(){});
      return;
    }


    that.setData({
      'findUser.findLength': parseInt(e.detail.value)+1
    })
  },
  queryUserFind:function(pkId,tag){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tag, true);
    httpClient.send(request.url.queryUserFind, "GET", { pkId:pkId});
  },
  giveUpUserPkFind:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (time) {
      that.data.findUser.statu = null;
      that.setData({
        findUser:that.data.findUser,
        leftTime:time
      })
    })
    httpClient.send(request.url.giveUpUserPkFind, "GET", {pkId:that.data.pk.pkId});

  },
  startFind:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("timePay", function (time) {
      template.createOperateDialog(that).show("提示","时间不足," + "剩余可打捞时间"+time,function(){
        wx.navigateTo({
          url: '/pages/pk/payForTime/payForTime',
        })
    },function(){});
    })
    httpClient.send(request.url.startUserPkFind, "POST", {
      pkId:that.data.pk.pkId,
      text:that.data.findUser.text,
      img1:that.data.findUser.img1,
      img2:that.data.findUser.img2,
      img3:that.data.findUser.img3,
      findLength:that.data.findUser.findLength,
    });


  },
  saveFind:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.saveUserPkFind, "POST", {
      pkId:that.data.pk.pkId,
      text:that.data.findUser.text,
      img1:that.data.findUser.img1,
      img2:that.data.findUser.img2,
      img3:that.data.findUser.img3,
      findLength:that.data.findUser.findLength,
    });


  },
  clearUserFind:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.clearUserFind, "GET", {pkId:that.data.pk.pkId});


  },
  create:function(){
    var that = this;
    that.setData({
        'findUser':{}
    })


  }
  






})