// pages/manage/cashiers/cashiers.js
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
    cashiers:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.init("label");
  },
  queryCashierss:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.addHandler("success", function (cashiers) {
      that.setData({
        cashiers:cashiers,
          page:1,
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
    httpClient.send(request.url.allCashiers, "GET", {});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // var that = this;

    //   if(that.data.pkEnd){return;}
    //   var user = wx.getStorageSync('user');
    //   var fromUser = wx.getStorageSync('fromUser')
    //   var httpClient = template.createHttpClient(that);
    //   httpClient.setMode("label", false);
    //   httpClient.addHandler("success", function (pagePks) {
    //     that.setData({
    //         page:that.data.page + 1,
    //         cashiers:that.data.pks.concat(pagePks)
    //     })
    //   })
    //   httpClient.send(request.url.nextPageCashiers, "GET",{ userId:user.userId ,page:that.data.page});
    
  },


  init:function (tab) {
    var that = this;
    that.queryCashierss(tab);
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryCashierss("");
  },




  // viewPk:function (res) {
  //   var pkid = res.currentTarget.dataset.pkid;
  //   wx.navigateTo({
  //     url: '/pages/pk/pk/pk?pkId=' + pkid,
  //   })
  // },
  createCashier:function()
  {
    var that = this;
    login.getUser(function(user){

      template.createEditTextDialog(that).show("添加用户", "用户名称","", 50, function (name) {
        
                // , urls
                var httpClient = template.createHttpClient(that);
                httpClient.setMode("label", true);
                httpClient.addHandler("success", function (post) {
                  that.init("label");
                })
                httpClient.send(request.url.createCashier, "GET",{name:name});
            
  
  
  
      });





    })
  },

  changeStatu:function (res) {
    var that = this;
    var cashierId = res.currentTarget.dataset.cashierid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
      that.init("label");
    })
    httpClient.addHandler("init", function () {
        that.init("");
        template.createOperateDialog(that).show("提示","未上传货品图片，无法启用该用户",function(){
        
        },function(){});
    })


    
    httpClient.send(request.url.changeCahierStatu, "GET",{cashierId:cashierId});

  },
  delete:function(res){
    var that = this;
    var cashierId = res.currentTarget.dataset.cashierid;
    template.createOperateDialog(that).show("提示","确定删除该管理员吗",function(){

      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
        that.init("label");
      })
      httpClient.addHandler("closeCashier", function () {
          that.init("");
          template.createDialog(that).show("提示", "请先关闭用户");
      })
      httpClient.addHandler("success", function () {
        that.init("");
      })
      httpClient.addHandler("noCashier", function () {
        that.init("");
        template.createDialog(that).show("错误", "用户不存在");
      })

      httpClient.send(request.url.deleteCashier, "GET",{cashierId:cashierId});

    },function(){});


  },





  show:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  },
  uploadLink:function(res)
  {
      var that = this;
      var type = res.currentTarget.dataset.type;
      var cashierId = res.currentTarget.dataset.cashierid;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed', 'original'],
        sourceType: ['album', 'camera'],
        success(res) {
  
          template.uploadImages3("cashierLink", res.tempFilePaths, that,
          function (urls) {
              //传输成功
              wx.hideLoading({
                complete: (res) => {},
              })
              console.log("---start---" ,urls);
  
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (post) {
                tip.showTip("上传成功......");
                that.queryCashierss("label");
  
              })
              httpClient.send(request.url.uploadCashierLink, "GET",{linkImg: urls[0],cashierId:cashierId,type:type}
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
          
        },
      })
  






  },




})