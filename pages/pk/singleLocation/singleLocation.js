// pages/pk/home/home.js
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
const tipUtil = require('./../../../utils/tipUtil.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:0,
    scale:16,
    latitude: 30.319739999999985,
    //经度
    longitude: 112.222,
    circle:[],
    markers:[],


    


    pks: [],
    user:{},
    sign: "欢迎打卡君!",
    type:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })
    locationUtil.getLocation(function (latitude,longitude){
      var distance = locationUtil.getDistance(latitude,longitude,options.latitude, options.longitude)
      that.setData({
        length:distance*1000,
        lengthStr:distance<1?distance*1000+"米":distance+"公里"
      })
    })
 
    that.setData({
      latitude:options.latitude,
      longitude: options.longitude,
      name:options.name,
      address: options.address
    })
    that.queryLocation("page");
    





  },
  queryLocation:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.send(request.url.searchPk, "GET", { latitude:that.data.latitude, longitude: that.data.longitude,name: that.data.name});


  },

  buildLocation:function () {
    var that = this;
    that.setData({
      mode:1
    })

  },
  //
  editType:function(){
    var that = this;
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/editTag/editTag?type='+that.data.type
      })
    })


  },
  editSign:function(){
    var that = this;
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=editSign&text='+that.data.sign
      })
    })


  },
  confirmBuild:function () {

    var that = this;
    
    if(!that.data.sign ||that.data.sign.length===0 ){
      tipUtil.showContentTip("签名不能为空!");
      return;
    }
    if(!that.data.type ||that.data.type.length===0 ){
      tipUtil.showContentTip("类型标签不能为空!");
      return;
    }
    if(!that.data.backUrl ||that.data.backUrl.length===0 ){
      tipUtil.showContentTip("背景图不能为空!");
      return;
    }
    if(that.data.length > that.data.maxLength*1000)
    {
      tipUtil.showContentTip("仅能创建"+that.data.maxLength+"公里范围内的卡点!");
      return;

    }


    var postEntity = {
      latitude:that.data.latitude, 
      longitude: that.data.longitude,
      name:that.data.name, 
      address: that.data.address,
      sign: that.data.sign,
      type: that.data.type,
      backUrl:that.data.backUrl
    }
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("pay", function () {
        
      template.createOperateDialog(that).show("余额不足?", "余额不足?...", function () {
          wx.navigateTo({
            url: '/pages/pk/payForPk/payForPk',
          })
      }, function () {});


    })


    httpClient.send(request.url.buildPk, "POST", postEntity);





  },



    selectImg:function(res)
    {
      var that = this;
  
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed', 'original'],
        sourceType: ['album'],
        success(res) {
          // var files = new Array();
          // files.concat(res.tempFilePaths);
          var files = res.tempFilePaths;
          template.uploadImages3("PK-Back", files,that, function(urls){

            that.setData({
              backUrl:urls[0]
            })


          }, function(){});
  
  
        },
      })
  
  
  
  
    },
  

})