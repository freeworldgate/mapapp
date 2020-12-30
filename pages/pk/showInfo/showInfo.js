// pages/pk/comments/comments.js
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
  
    greates:[]
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
    var pkId = options.pkId;

    that.setData({
      pkId:pkId,
    })

    that.queryComments("page",pkId);

  },

  uploadComplainImg:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        var path = res.tempFilePaths[0];
        that.setData({
          img:path
        })



      },
    })




  },

  queryComments:function(tab,pkId)
  {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.send(request.url.queryGreateUsers, "GET", {pkId:pkId});
  },


  onReachBottom:function()
  {
      var that = this;
      if(that.data.pkEnd){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (nextPages) {
        that.setData({
            page:that.data.page + 1,
            greates:that.data.greates.concat(nextPages)
        })
      })
      httpClient.send(request.url.queryMoreGreateUsers, "GET",{ pkId:that.data.pkId,page:that.data.page});
  
  },

  publish:function()
  {
    var that = this;
    

    template.uploadImages3("complain", [that.data.img], that,
    function (urls) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (complain) {
          var ncoms = that.data.complains;
          for (var i = ncoms.length-1;i >= 0 ;i--) {
              if (ncoms[i].complainId === complain.complainId) 
              {
                ncoms.splice(i,1);        //执行后aa.length会减一
              }
          }
    
    
          ncoms.unshift(complain);
          that.setData({
            complains: ncoms,
            text:"",
            img:""
          })
        })
        httpClient.send(request.url.complain, "GET",{ pkId:that.data.pkId,url:urls[0] ,text: that.data.text,});
    },
    function () {
      showTip("发布失败......");
      page.editImageDialog.fail();
    });















  },
  showImg:function(res){
    var img = res.currentTarget.dataset.img;
    wx.previewImage({
      urls: [img],
    })


  }



})