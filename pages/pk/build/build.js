// pages/pk/home/home.js
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

    scale:16,
    polyline:[],
    latitude: 30.319739999999985,
    longitude: 112.222,
    circle:[],
    markers:[],



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
    that.setData({
      name:options.name,
      address:options.address,
      latitude:options.latitude- 0.003,
      longitude:options.longitude 
    })
    var markers = [{  id:0,latitude:options.latitude,longitude:options.longitude ,iconPath:"/images/marker.png",width:"34px",height:"34px",borderRadius:34,rotate:0,alpha:1}];
    var circles = [{  id:1,latitude:options.latitude,longitude:options.longitude,color:"#00000000",fillColor:"#00000010",radius:150,strokeWidth:0}];
   


    that.setData({
      markers:markers,
      circles:circles
    })
    
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          mylatitude:latitude,
          mylongitude:longitude
        })

        that.buildLine(latitude,longitude,options.latitude,options.longitude);


      }
     })

  },
  buildLine:function(latitude,longitude,latitude1,longitude1){
    // var that = this;
    // var polyline = [{points:[{latitude:latitude,longitude:longitude},{latitude:latitude1,longitude:longitude1}]}]
    // that.setData({
    //   polyline:polyline
    // })


  }




})