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

    pks: [],

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
    wx.hideShareMenu({
      complete: (res) => {},
    })


    that.querySort("page",1);


  },
  
  querySort:function (label,page) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(label, false);
    httpClient.send(request.url.queryPkList, "GET", {page:page});
  },



  editRange:function(res){
      var pk = res.currentTarget.dataset.pk;
      wx.setStorageSync('editRange', pk)
      wx.navigateTo({
        url: '/pages/manage/setPkRange/setPkRange',
      })


  },

  setpage:function(e){
    var that = this;
    template.createEditNumberDialog(that).show("设置次数", 20,"", function (value) {
        if(value<1){tip.showContentTip("非法页数");return;}

        that.querySort("label",value);


    },function(){});
  },
  decr:function(res){
    var that = this;
    var page = res.currentTarget.dataset.page;
    if(page<2){tip.showContentTip("已达最小页面");return;}
    that.querySort("label",page-1);
  },
  incr:function(res){
    var page = res.currentTarget.dataset.page;
    var that = this;
    var page = res.currentTarget.dataset.page;

    that.querySort("label",page+1);


  },

  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },
  login:function(){
    login.getUser(function(user){})    
  },



  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },
  hiddenMap:function(){
    this.setData({
      mapShow:false
    })
  },
  showMap:function(res){
    var that = this;
    var pk = res.currentTarget.dataset.pk; 
    that.setData({
      mapShow:true,
      // includePoints:[{latitude:that.data.latitude,longitude:that.data.longitude},{latitude:pk.marker.latitude,longitude:pk.marker.longitude}],
      markers:[pk.marker],
      circles:[pk.circle],
      latitude:pk.marker.latitude,
      longitude:pk.marker.longitude,
      scale:pk.type.scale
      
    })
  },

  setPkCode:function()
  {
    var that = this;
    template.createEditNumberDialog(that).show("输入Code", 20,"", function (value) {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.setPkCode, "GET",{value:value});
    })




  }

  ,

  buildSample:function(){
    var that = this;
    template.createOperateDialog(that).show("制作样例","请根据您的主题选择9张图片制作图册封面",function(){
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed', 'original'],
        sourceType: ['album', 'camera'],
        success(files) {
          if(files.tempFilePaths.length != 9){
            template.createDialog(that).show("选择错误", "请选择9张图片制作样例...");
            return;
          }


          var imgs = new Array();
          for(var i=0;i<9;i++)
          {
            that.imageInfo(imgs,files.tempFilePaths[i]);

          }


          
  
        },
      })
    
  },function(){});




  },

  imageInfo:function(imgs,url){

    wx.getImageInfo({
      src:url,
      success:function(res){
        
        var imgW = res.width;
        var imgH = res.height;
        var x = imgW>imgH?(imgW-imgH)/2:0;
        var y = imgW>imgH?0:(imgH-imgW)/2;
        var size = imgW>imgH?imgH:imgW;
        var img = {x:x,y:y,size:size,url:url};
        imgs.push(img);
        if(imgs.length === 9){
          wx.setStorageSync('drawImgs', imgs);
          wx.navigateTo({
            url: '/pages/pk/drawImg/drawImg',
          })
        }

      }
    })

  },


  setLocation:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid; 
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("添加主题位置", "将主题锁定到当前位置，以便附近用户可见...", function () {
      tip.showContentTip("定位中...")
      that.setNetLocation(pkId,index);
    }, function () {});
  },

  setNetLocation: function (pkId,index) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation(pkId,index);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation(pkId,index);
        }
        else {
          //调用wx.getLocation的API
          that.getLocation(pkId,index);
        }
      }
    })
  },
  // 获取定位当前位置的经纬度
  getLocation: function (pkId,index) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let speed = res.speed
        let accuracy = res.accuracy;
        tip.showContentTip("定位中...")
        that.getLocal(latitude, longitude,pkId,index)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude,pkId,index) {
    let that = this;
    var myAmapFun = new amapFile.AMapWX({key:'528540a597af4bb3937965f09078dba4'});
    myAmapFun.getRegeo({
      success: function(data){
        var cityCode = data[0].regeocodeData.addressComponent.citycode;
        var cityName = data[0].regeocodeData.addressComponent.city;
        var desc = data[0].desc;
        var name = data[0].name;
        var latitude = data[0].latitude;
        var longitude = data[0].longitude;

        var msg = name+"&&TAG&&"+desc+"&&TAG&&"+cityName+"&&TAG&&"+cityCode+"&&TAG&&"+latitude+"&&TAG&&"+longitude;

        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", true);
        httpClient.addHandler("success", function (location) {
          tip.showContentTip("更新主题位置") 
          var msg = "pks[" + index + "].location"
          that.setData({
            [msg]: location
          })
         

  
        })
        httpClient.send(request.url.setLocation, "GET",
          {
            pkId:pkId,
            name:name,
            desc:desc,
            city:cityName,
            cityCode:cityCode,
            latitude:latitude,
            longitude:longitude
          }
        );    


        //成功回调
        that.setData({
          address:data[0].desc
        })
        console.log("地址:",latitude,longitude,data);
      },
      fail: function(info){
        //失败回调
        tip.showContentTip("获取位置失败...");
      }
    })



  },







})