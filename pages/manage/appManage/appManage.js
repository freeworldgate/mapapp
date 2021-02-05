// pages/manage/appManage/appManage.js

var request = require('./../../../utils/request.js')

var template = require('./../../../template/template.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var password = wx.getStorageSync('password')
    if(password){
      that.setData({password:password});
    }

  },
  inputActiveCode:function(res){
    var that = this;
    var value = res.detail.value;
    that.setData({
      password: value,
    })
    wx.setStorageSync('password', value)
  },
  login:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (password) {
      that.setData({
        password:password,
        switch:true
      });
      wx.setStorageSync('password', password);
    })
    httpClient.send(request.url.loginManager, "GET", {});
    
    
  }


})