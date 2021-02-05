// pages/pk/pk/pk.js
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
    red:'ff',
    blue:'ff',
    green:'ff',
    opacity:'ff',
    img:"",
    fontColor:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryBacks, "GET", {});

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
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (data) {
      var backs = that.data.backs.concat(data);
      that.setData({
        backs: backs,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextBacks, "GET", {  page: that.data.page });

    // wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){

  },


  openText:function(res)
  {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var tag = 'findUsers['+index+'].tag';
    var ctag = that.data.findUsers[index].tag;
    that.setData({
      [tag]:!ctag
    })
  },
  approvePass:function(res){
    var that = this;
    var group = res.currentTarget.dataset.group;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (singlegroup) {
      var key = "groups["+index+"]";
      that.setData({
        [key] : singlegroup,
      });
    })
    httpClient.send(request.url.passGroup, "GET", {groupId:group.groupId});


  },
  changeopacity:function(e)
  {
    var value = e.detail.value<16?"0"+e.detail.value.toString(16):e.detail.value.toString(16);
    this.setData({
      opacity:value
    })
  },
  changered:function(e)
  {
    var value = e.detail.value<16?"0"+e.detail.value.toString(16):e.detail.value.toString(16);
    this.setData({
      red:value
    })
  },
  changeblue:function(e)
  {
    var value = e.detail.value<16?"0"+e.detail.value.toString(16):e.detail.value.toString(16);
    this.setData({
      blue:value
    })
  },
  changegreen:function(e)
  {
    var value = e.detail.value<16?"0"+e.detail.value.toString(16):e.detail.value.toString(16);
    this.setData({
      green:value
    })
  },
  changetextcolor:function()
  {
      var that = this;
      that.setData({
        fontColor:!that.data.fontColor
      })
  },
  setImage:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        template.uploadImages3("backImg", res.tempFilePaths, that,
        function (urls) {
            //传输成功
            that.setData({
              img:urls[0]
            })
  
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
  remove:function(res){

    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("删除主题","确定删除主题?",function(){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (k) {
        that.data.backs.splice(index, 1); 
        that.setData({
          backs: that.data.backs
        })
      })
      httpClient.send(request.url.removeBack , "GET",{backId:id});

    },function(){});

  },
  confirm:function(){
    var that = this;
    var backColor = that.data.red+that.data.blue+that.data.green+that.data.opacity;
    var fontColor=that.data.fontColor?'000000':'ffffff';
    var imgUrl = that.data.img;


    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (back) {
      that.data.backs.unshift(back);
      that.setData({backs: that.data.backs})
      that.setData({
        red:'ff',
        blue:'ff',
        green:'ff',
        opacity:'ff',
        img:"",
        fontColor:true
      })


    })
    httpClient.send(request.url.addTextBack , "GET",{backColor:backColor,fontColor:fontColor,imgUrl:imgUrl});





  }







})