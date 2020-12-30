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



    pks: [],

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
  that.queryInvites("page");






  },
  queryInvites:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, false);
    var user = wx.getStorageSync('user');
    var fromUser = wx.getStorageSync('fromUser')
    var pkId = wx.getStorageSync('pkId')
    httpClient.send(request.url.queryHomePage, "GET", { userId:user.userId,fromUser:fromUser,pkId:pkId });


  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },







  addPost: function () {

    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    httpClient.addHandler("publishPost", function () {
      template.createOperateDialog(that).show("发布图册", "将要消耗您一个图册", function () {
        that.publishPost();
      }, function () { });
    });
    httpClient.addHandler("free", function () {
      that.publishPost();
    });
    httpClient.send(request.url.addPost, "GET", { pkId: that.data.pkId });
  },

  publishPost: function () {
    var that = this;

    template.createEditImageDialog(that).setDialog("编辑图册", "编辑你想说的话", 9, function () {
      // 发布图册



    }).show();
  },

  showPk:function(res){
    var that = this;
    var topic = res.currentTarget.dataset.topic;
    var watchword =  res.currentTarget.dataset.watchword;

    template.createShowPkDialog(that).show(topic,watchword)

  },







  click: function (e) {
    var tab = parseInt(e.currentTarget.dataset.tab);
    var id = e.currentTarget.dataset.id;
    var user = wx.getStorageSync("user");

    var httpClient = template.createHttpClient(this);
    httpClient.setMode("label", false);
    httpClient.addHandler("login", function () {
      login.getUser(function (user) {
        console.log("登录成功:", user);
      });
    });
    httpClient.send(request.url.click, "GET", { userId: user.userId, tab: tab, id: id });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onHide:function(){
    // var that = this;
    // clearInterval(that.data.clock);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // var that = this;
    // var i = setInterval(function() {
    //   for(var i=0;i<that.data.pks.length;i++)
    //   {
    //     that.data.pks[i].imgs.sort(function(){
    //       return Math.random()-0.5;
    //     });

        
    //     var imgs = "pks[" + i + "].imgs";
    //     that.setData({
    //       [imgs]:that.data.pks[i].imgs
    //     })








    //   }  
      




    // }, 1000)
    // that.data.clock = i;


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function (params) {
    var that = this;
    template.createPageLoadingError(that).hide();
    if(that.data.pageTag)
    {
      that.queryInvites("label");
    }
    else
    {
      that.queryInvites("page");

    }



},

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   var that = this;

  //     if(that.data.pkEnd){return;}
  //     var user = wx.getStorageSync('user');
  //     var fromUser = wx.getStorageSync('fromUser')
  //     var httpClient = template.createHttpClient(that);
  //     httpClient.setMode("label", false);
  //     httpClient.addHandler("success", function (pagePks) {
  //       that.setData({
  //           page:that.data.page + 1,
  //           pks:that.data.pks.concat(pagePks)
  //       })
  //     })
  //     httpClient.send(request.url.nextHomePage, "GET",{ userId:user.userId,fromUser:fromUser ,page:that.data.page});
    
  // },

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
    
    httpClient.addHandler("unlock", function (link) {

      template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
        wx.navigateTo({
          url: link.castV1,
        })

    },function(){});
    })
    httpClient.send(request.url.viewPk, "GET",{pkId:pkid});   

  },

  showImg:function(res){
    var imgs = res.currentTarget.dataset.imgs;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:imgs[index],
      urls: [imgs[0],imgs[1],imgs[2],imgs[3],imgs[4],imgs[5],imgs[6],imgs[7],imgs[8]],
    })


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

})