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
var amapFile = require('./../../../utils/amap-wx.js')



const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
const r_width = 2*vwPx;
const l_width = 2*vwPx;
const img_width = 10*vwPx;
const small_size = (100*vwPx - r_width - l_width*2 - img_width - 1*vwPx)/3;
const large_size = small_size * 2 + 0.5 *vwPx


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'https://oss.211shopper.com/dir2/wx-1606375746086.jpg'
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


    var userId = options.userId;   

    that.setData({
      userId:userId
    })


    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryUserCard, "GET", {targetId:options.userId});
    
  },

  userCardApply:function(res){
    var that = this;

    var type = res.currentTarget.dataset.type;
    var targetId = res.currentTarget.dataset.targetid;

    login.getUser(function(user){
      if(user.userId === targetId){
          wx.navigateTo({
            url: '/pages/pk/userCardApply/userCardApply?targetUserId='+targetId + "&type=" + type,
          })
      }
      else
      {
        template.createOperateDialog(that).show("仅用户自身可见?", "仅用户自身可见...", function () {
        }, function () {});
      }
    })
  },


  apply:function(){
    var that = this;
    login.getUser(function(user){
        template.createEditTextDialog(that).show("想认识Ta", "编辑留言...","", 120,function(text){
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          // httpClient.addHandler("success", function () {
          //   that.setData({
          //     userApply:{applyer:user,text:text},
          //   })
          // },function(){});
          httpClient.send(request.url.userCardApply, "GET", { text:text,targetId:that.data.userId});  
        });
    })




  },
  uploadImg:function(){
    var that = this;
    login.getUser(function(user){
       if(user.userId === that.data.userId)
       {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed', 'original'],
            sourceType: ['album'],
            success(res) {
              var files = res.tempFilePaths;
              template.uploadImages3("PK-User-Back", files,that, function(urls){
                
                var httpClient = template.createHttpClient(that);
                httpClient.setMode("label", true);
                httpClient.addHandler("success", function () {
                  that.setData({
                    userCard:urls[0],
                  })
                },function(){});
                httpClient.send(request.url.setUserCard, "GET", { userCard:urls[0]});  
              }, function(){});
            },
          })
       }
    })
  

  }

})