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
    imgUrl:'https://oss.211shopper.com/dir2/wx-1606375746086.jpg',
    posts: [],
    pkEnd:false
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
    var targetId = options.userId;
    that.setData({
      targetId:targetId
    })
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.userPublishPosts, "GET", {targetId:targetId});

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
      httpClient.addHandler("success", function (posts) {
        that.setData({
            page:that.data.page + 1,
            posts:that.data.posts.concat(posts)
        })
      })
      httpClient.send(request.url.nextUserPublishPosts, "GET",{ targetId:that.data.targetId ,page:that.data.page});
    
  },
  uploadImg:function(){
    var that = this;

  
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        var files = res.tempFilePaths;
        template.uploadImages3("PK-User-Back", files,that, function(urls){

            that.setData({
              imgUrl:urls[0],
            })


        }, function(){});


      },
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



  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
    })


  },

  follow:function(res){
    var that = this;
    var targetId = res.currentTarget.dataset.targetid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.followUser, "GET", {followerId:targetId});
  },
  cancelFollow:function(res){
    var that = this;
    var targetId = res.currentTarget.dataset.targetid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.cancelFollow, "GET", {followerId:targetId});
  },
  onShow:function () {

    // var that = this;
    // var user = wx.getStorageSync('user');
    // if(user && (that.data.posts.length === 0) && !that.data.pkEnd ){that.init("label");}
    // else{}
    

  },


  onPullDownRefresh:function (params) {
      var that = this;
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.userPublishPosts, "GET", {targetId:that.data.targetId});
  },
  back:function(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },



  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },










  deletePost:function(res){
    var that = this;

    var post = res.currentTarget.dataset.post;
    var pkId = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("删除打卡信息?", "删除?...", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
              that.data.posts.splice(index, 1); 
              that.setData({
                posts: that.data.posts,
              })


      })
      httpClient.send(request.url.removePost, "GET", { postId: post.postId,pkId:pkId });
    }, function () {});




  },
})