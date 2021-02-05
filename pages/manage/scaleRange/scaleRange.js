// pages/pk/home/home.js


var request = require('./../../../utils/request.js')
var login = require('./../../../utils/loginUtil.js')
var inviteReq = require('./../../../utils/invite.js')
var template = require('./../../../template/template.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    offset:0,
    scale:16,
    latitude: 31.9902783203125,
    //经度
    longitude: 118.73781711154514,
    circles:[{
      id:0,
      latitude:31.9902783203125,
      longitude:118.73781711154514,
      color:"#00000000",
      fillColor:"#00000010",
      radius:'160',
      strokeWidth:0
    }],

    markers: [{
      //标记点 id
      id: 1,
      //标记点纬度
      latitude: 31.9902783203125,
      //标记点经度
      longitude: 118.73781711154514,
      name: '行之当前的位置',
      iconPath : "/images/marker.png",
      width:'34px',
      height:'34px',
      borderRadius:34,
      alpha:1,
      rotate:0
    }],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.locate();
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
  })

  that.queryInvites("label");

  },


  changePk:function(res){
    var that = this;
    var current =  res.detail.current;
    var currentRange = that.data.rangs[current];
    var key = 'circles[0].radius'
    that.setData({
          scale:currentRange.scale,
          [key]:currentRange.range,
          offset:currentRange.offset
          // latitude: 31.9902783203125 - currentRange.offset
    })

    // that.updateDistance();
  },




  changeoffset:function(e){

    var value =  e.detail.value;
    var offset = parseFloat(value/10000.0);
    this.setData({
      offset: offset
    })

  },
  changescale:function(e)
  {
    var value = e.detail.value;
    this.setData({
      scale:value
    })


  },

  queryInvites:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, false);
    httpClient.addHandler("success", function (rangs) {
        var current = rangs[0];
        var key = 'circles[0].radius'
        that.setData({
          rangs:rangs,
          scale:current.scale,
          [key]:current.range,
          offset: current.offset
        })
    })
    httpClient.send(request.url.queryScaleRangs, "GET", {});
  },
  
  save:function()
  {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    httpClient.send(request.url.setScaleRange, "GET", {range:that.data.circles[0].radius,scale:that.data.scale,offset:that.data.offset});
  }
})