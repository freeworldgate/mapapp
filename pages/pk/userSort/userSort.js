// pages/pk/pk/pk.js
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



const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
const r_width = 2*vwPx;
const l_width = 2*vwPx;
const img_width = 10*vwPx;
const small_size = (100*vwPx - r_width - l_width*2 - img_width - 1*vwPx)/3;
const large_size = small_size * 2 + 0.5 *vwPx


Page({


  data: {
    sorts:[]
  },


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
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryUserPkPosts, "GET", {pkId:options.pkId});

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  openText:function(res)
  {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var tag = 'posts['+index+'].tag';
    var ctag = that.data.posts[index].tag;
    that.setData({
      [tag]:!ctag
    })
  },
  uploadImage:function(){
    var that = this;
  
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        var files = res.tempFilePaths;
        template.uploadImages3("PK-User-Back", files,that, function(urls){

          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function (image) {

              for(var i=0;i<that.data.images.length;i++)
              {
                  if(image.imageId === that.data.images[i].imageId ){
                    that.data.images.splice(i, 1); 
                    break;
                  }

              }


              that.data.images.unshift(image);
              that.setData({
                images:that.data.images
              })
          })
          httpClient.send(request.url.uploadPkImages, "GET", { pkId:that.data.pkId,imgUrl:urls[0]});




        }, function(){});


      },
    })






  },
  userCenter:function(res){
    var that = this;
    var follower =  res.currentTarget.dataset.follower;

    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/userPublishPost/userPublishPost?userId='+follower.userId,
      })

    })



  },

  showImg:function(res){
    var that  = this;
    var index = parseInt(res.currentTarget.dataset.index);
    var imgs = res.currentTarget.dataset.imgs;
    if(index > imgs.length-1){return;}
    var current = imgs[index].imgUrl;
    var images = [];
    for(var i=0;i<imgs.length;i++)
    {
        images[i] = imgs[i].imgUrl;
    }
    wx.previewImage({
      current:current,
      urls: images,
    })
  },


  follow:function(res){
    var that = this;
    var targetId = res.currentTarget.dataset.targetid;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.send(request.url.followUser, "GET", {followerId:targetId});
    var key = "followers["+index+"].followStatu";
    that.setData({
      [key] : 1,
    });


  },
  cancelFollow:function(res){
    var that = this;
    var targetId = res.currentTarget.dataset.targetid;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.send(request.url.cancelFollow, "GET", {followerId:targetId});
    var key = "followers["+index+"].followStatu";
    that.setData({
      [key] : 0,
    });

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
    httpClient.setMode("label", true);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.sorts.concat(data);
      that.setData({
        sorts: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextUserPkPost, "GET", { page: that.data.page,pkId: that.data.pkId });

    // wx.stopPullDownRefresh()
  },
  setUser:function(res){
    var userId =  res.currentTarget.dataset.user;
    var user = wx.getStorageInfoSync("user");
    user.userId = userId;
    wx.setStorageSync('user', user);
    wx.reLaunch({
      url: '/pages/pk/locate/locate',
    })

  }
})