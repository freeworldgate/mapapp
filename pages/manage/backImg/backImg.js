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

    pks: [],
    albumType:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;




    wx.hideShareMenu({
      complete: (res) => {},
    })
    wx.setStorageSync('albumType', 0);
    that.init("label");
    
  },
  
  queryPks:function (tab) {
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
    var albumType = wx.getStorageSync('albumType');
    httpClient.send(request.url.queryBackImgs, "GET", {type:albumType});
  },

  albumType:function(res)
  {
    var that = this;
    var type = res.currentTarget.dataset.type;
    wx.setStorageSync('albumType', parseInt(type))
    that.setData({
      albumType: parseInt(type)
    })
    that.init("label");


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
      var albumType = wx.getStorageSync('albumType');
      httpClient.send(request.url.moreBackImgs, "GET",{ userId:user.userId ,page:that.data.page,type:albumType});
    
  },



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
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        template.uploadImages3("backImg", res.tempFilePaths, that,
        function (urls) {
            //传输成功
            console.log("---start---" ,urls);

    
            // , urls
            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.addHandler("success", function (img) {
              that.data.pks.push(img);
              that.setData({pks: that.data.pks})


            })
            var albumType = wx.getStorageSync('albumType');
            httpClient.send(request.url.uploadBackImg, "GET",
              {
                imgUrl: urls[0],
                type:albumType
              }
            );
  
  
        },
        function () {
            
            //传输失败
            wx.hideLoading({
              complete: (res) => {
                tip.showContentTip("失败......");
              },
            })
            
  
        });
        
      },
    })
  },

  removeImg:function(res)
  {
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("删除主题","确定删除主题?",function(){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (k) {
        that.data.pks.splice(index, 1); 
        that.setData({
          pks: that.data.pks
        })
      })
      httpClient.send(request.url.removeImg , "GET",{id:id});

    },function(){});
  
  
  },
  viewImg:function(res)
  {
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },

  
})