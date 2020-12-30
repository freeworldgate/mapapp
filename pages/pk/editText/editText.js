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


Page({

  /**
   * 页面的初始数据
   */
  data: {
      maxLength:200,
      left:200,
      text:"",
      placeholder:''
  },

  onLoad: function (options) {

    var that = this;
    //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })
    var scene = options.scene;
    var text = options.text;
    if(scene == 'findUser'){
      that.setData({
          title:'打捞场景',
          desc:'场景描述',
          scene:scene,
          maxLength:200,
          left:200,
          text:text,
          placeholder:'遇到ta的场景'
      })
    }




  },
  _input:function(res){
    var that = this;
    var value = res.detail.value;
    if (value.length >= that.data.maxLength) {
      showTip("内容超出最大长度");
      // return;
    }
    that.setData({
      text: value,
      left:that.data.maxLength - value.length
    })


  },
  save:function(){
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if(that.data.scene==='findUser'){
      prevPage.setData({
        'findUser.text': that.data.text
      });
    }

    wx.navigateBack({
      delta: 0,
    })

  }
})