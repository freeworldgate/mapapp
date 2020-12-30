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
    leftPks:0,
    unlock:0,
    pkTimes:0,
    inviteTimes:0,
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
    that.init("label");
  },
  queryInvites:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
 
    httpClient.send(request.url.userPosts, "GET", {});
  },

  setUser:function(res){
    var userId = res.currentTarget.dataset.user;

    var user = wx.getStorageSync('user');
    user.userId = userId;
    wx.setStorageSync('user', user);
    wx.reLaunch({
      url: '/pages/pk/home/home',
    })

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
      httpClient.send(request.url.nextUserPosts, "GET",{ userId:user.userId ,page:that.data.page});
    
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



  editText:function (res) {
    var that = this;
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;
    template.createEditTextDialog(that).show("编辑","编辑内容",post.topic, 120, function (text) {
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (cpost) {
      
    
                var key = "posts[" + index + "].topic"
                that.setData({
                  [key]:text
                })
    
              })
              httpClient.send(request.url.replaceText, "GET",
                {
                  pkId: post.pkId,
                  postId: post.postId,
                  text:text
                }
              );    



    });






  },
  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
    })


  },


  // onShow:function () {

  //   var that = this;
  //   var user = wx.getStorageSync('user');
  //   if(user && (that.data.posts.length === 0) && !that.data.pkEnd ){that.init("page");}
  //   else{}
    

  // },

  init:function (tab) {
    var that = this;
    var user = wx.getStorageSync('user');
    if(user){
      that.setData({user:user})
    }
    if(user && (that.data.posts.length === 0))
    {
      that.queryInvites(tab);
    }
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryInvites("label");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  



  pkDetail:function (params) {
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=PK01',
    })
  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },
  viewPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    httpClient.addHandler("group", function (link) {

        template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
          wx.navigateTo({
            url: link.castV1,
          })

      },function(){});
    })

    httpClient.send(request.url.viewPk, "GET",{pkId:pkid});   

  },
  groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.viewGroupCode, "GET",{pkId:pkId});   

  },
  approverMessageDetail:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    login.getUser(function (user) {

      wx.navigateTo({
        url: '/pages/pk/messageInfo/messageInfo?pkId=' + pkId ,
      })   
    })


  },

  showPk:function(res){
    var that = this;
    var topic = res.currentTarget.dataset.topic;
    var watchword =  res.currentTarget.dataset.watchword;

    template.createShowPkDialog(that).show(topic,watchword)





  },
  importPost:function(res){
    var that = this;
    var postId =  res.currentTarget.dataset.postid;
    var pkId =  res.currentTarget.dataset.pkid;
    var style =  res.currentTarget.dataset.style;
    var post =  res.currentTarget.dataset.post;
    wx.setStorageSync('importPost', post);
    wx.navigateTo({
      url: '/pages/pk/drawPost/drawPost?pkId=' + pkId + "&postId=" + postId +"&imgBack=" + that.data.imgBack + "&style=" + style ,
    })

  },
  login:function(){
    login.getUser(function(user){})    
  },
  freshPost:function(res){
    wx.navigateTo({
      url: '/pages/pk/prepost/prepost',
    })
    // var that = this;
    // var index =  res.currentTarget.dataset.index;
    // var post =  res.currentTarget.dataset.post;
    // post.postImages.sort(function(){
    //                return Math.random()-0.5;
    //         });

    // post.style = Math.floor(Math.random() * (6) + 1);
    // var upost = "posts[" + index + "]";
    // that.setData({
    //   [upost]:post
    // })

  },


  goApproving:function (res) {
    var that = this;
    var pkId =  res.currentTarget.dataset.pkid;
    var postId =  res.currentTarget.dataset.postid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("noApprove", function (urlPath) {
          wx.navigateTo({
            url: urlPath,
          })
          that.setData({verfiy:true})

    })
    httpClient.send(request.url.goApproving, "GET", { pkId: pkId, postId: postId});



  },


})