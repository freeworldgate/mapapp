// pages/pk/uploadImgs/uploadImgs.js
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
    text:"",
    left:200,
    maxLength:200,
    imgs:[],


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
    var pk = wx.getStorageSync('publish-pk', that.data.pk)
    wx.removeStorageSync('publish-pk')
    this.data.pkId = options.pkId;
    var imgFiles = options.imgs.split(",");
    var allFiles = this.data.imgs.concat(imgFiles);
    this.setData({
      imgs:allFiles,
      pkId:options.pkId,
      pk:pk
    })

    locationUtil.getLocation(function(latitude,longitude){

      var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
      that.setData({
        length:distance*1000,
        lengthStr:distance<1?distance*1000:distance
      })


    })


  },
  showLocation:function(res){
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

  _input:function(res){
    var that = this;
    var value = res.detail.value;
    if (value.length > that.data.maxLength) {
      showTip("内容超出长度");
      // return;
    }
    this.setData({
      'text': value,
      'left':that.data.maxLength - value.length
    })

  },
  _remove:function(res){
    var that = this;
    var index = parseInt(res.currentTarget.dataset.index);
    that.data.imgs.splice(index, 1);

    that.setData({
      imgs: that.data.imgs,
    })

  },

  _add:function () {
    var that = this;
    var num = 9-that.data.imgs.length
    wx.chooseImage({
      count: num,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {


        var imgFiles = that.data.imgs.concat(res.tempFilePaths);
        that.setData({
          imgs: imgFiles,
        })
      },
    })
  },
  
  
  upload:function(){
    var that = this;
    
    
    if(!that.data.imgs||that.data.imgs.length===0){
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (post) {
          tip.showTip("上传成功......");

          template.createLabelLoading(that).hide();
          wx.setStorageSync("userPost", post)
          wx.navigateBack({
            complete: (res) => {
              
              
            },
          })

        })
        httpClient.send(request.url.createPost, "GET",
          {
            pkId: that.data.pkId,
            title: that.data.text,
            imgUrls: new Array(),
          }
        );


    }
    else{

      
      template.uploadImages3("userUpload", that.data.imgs, that,
        function (urls) {
          //传输成功
          wx.hideLoading({
            complete: (res) => {},
          })
          console.log("---start---" ,urls);
          console.log("图片集合", urls);
          
          // , urls
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function (post) {
            tip.showTip("上传成功......");

            template.createLabelLoading(that).hide();
            wx.setStorageSync("userPost", post)
            wx.navigateBack({
              complete: (res) => {
                
                
              },
            })

          })
          httpClient.send(request.url.createPost, "GET",
            {
              pkId: that.data.pkId,
              title: that.data.text,
              imgUrls: urls,
            }
          );


          // page.editImageDialog.success();
          // createLabelLoading(page).hide();
          // createLabelLoadingSuccess(page).show();
      },
      function () {
          
          //传输失败
          wx.hideLoading({
            complete: (res) => {
              tip.showContentTip("上传失败......");
            },
          })
          

      });

    }

  }
})


