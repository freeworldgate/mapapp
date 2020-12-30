// pages/pk/post/post.js
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
    indicatorDots:false,
    vertical: true,
    autoplay: false,
    circular: false,
    current:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      complete: (res) => {},
    })
    var that = this;
    inviteReq.getHeight(function (res) {
      that.setData({
        top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })


    this.setData({
        pkId:options.pkId,
        postId:options.postId,
    })
    var that = this;
    this.queryPost("page",this.data.pkId,this.data.postId);

  },
  fresh:function(){

    this.queryPost("label",this.data.pkId,this.data.postId);
  },
  queryPost:function(tag,pkId,postId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tag, true);
    httpClient.send(request.url.queryPostById, "GET", { pkId: pkId, postId:postId});
  },
  onReady:function (params) {
  },
  click:function(res){
    var that = this;
    var index =  res.currentTarget.dataset.index;
    that.setData({
      current:index
    })

  },
  change:function(res){
    var that = this;
    var current =  res.detail.current;
    that.setData({
      current:current
    })
  },
  groupCode:function(params) {




    var that = this;
    login.getUser(function(user){
        wx.navigateTo({
          url: '/pages/pk/message/message?pkId='+ that.data.pkId +'&type=1',
        })


    })
    



  },
  freshPost:function(res){
    var that = this;


    that.data.post.postImages.sort(function(){
                   return Math.random()-0.5;
            });

    that.data.post.style = Math.floor(Math.random() * (6) + 1);

    that.setData({
      post: that.data.post
    })

  },
  importPost:function(res){
    var that = this;
    var postId =  res.currentTarget.dataset.postid;
    var pkId =  res.currentTarget.dataset.pkid;
    var style =  res.currentTarget.dataset.style;
    var post =  res.currentTarget.dataset.post;
    wx.setStorageSync('importPost', post);
    
    
    wx.navigateTo({
      url: '/pages/pk/drawPost/drawPost?pkId=' + pkId + "&postId=" + postId +"&imgBack=" + that.data.imgBack + "&style=" + style,
    })

  },


  onShareAppMessage:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.send(request.url.setApprover, "GET",{pkId: that.data.pkId,postId: that.data.postId})

    return {
      title: that.data.t55 +  "@" + that.data.creator.userName ,
      desc: "from" + that.data.post.creator.userName + '',
      imageUrl:that.data.post.creator.imgUrl,
      path: '/pages/pk/approver/approver?pkId=' + that.data.pkId + "&postId=" + that.data.post.postId + "&fromUser=" + that.data.user.userId ,
      
    }
    



  },
  isPostApproved:function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.addHandler("noApprove", function (urlPath) {
      template.createOperateDialog(that).show(that.data.t3, that.data.t4, function () {
          wx.navigateTo({
            url: urlPath,
          })
          that.setData({verfiy:true})
    }, function () {});
    })
    httpClient.send(request.url.isPostApproved, "GET", { pkId: that.data.pkId, postId: that.data.postId});
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
  approvePost:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.setApprover, "GET",{pkId: that.data.pkId,postId: that.data.postId})


  

  },
  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
    })
  },
  editSelfComment:function(){
    var that = this;
    template.createEditTextDialog(that).show(that.data.t5, that.data.t6,that.data.post.selfComment, 60, function (text) {
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (post) {
      
    
                that.setData({
                  "post.topic":text
                })
    
              })
              httpClient.send(request.url.editSelfComment, "GET",
                {
                  pkId: that.data.pkId,
                  postId: that.data.postId,
                  text:text
                }
              );    



    });



  },


  replace:function (res) {
    var that = this;
    var index = res.currentTarget.dataset.index;
    that.replaceImage(index);
    // var httpClient = template.createHttpClient(that);
    // httpClient.setMode("label", true);
    // httpClient.addHandler("online", function () {
    //   template.createOperateDialog(that).show("提示", that.data.t3, function () {
    //     that.replaceImage(index);
    //   }, function () {});
    // })
    // httpClient.addHandler("offline", function () {
    //   that.replaceImage(index);

    // })
    // httpClient.send(request.url.postStatu, "GET",
    //   {
    //     pkId: that.data.pkId,
    //     postId: that.data.postId,
    //   }
    // );

  },

  replaceImage:function (index) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        template.uploadImages3("userUpload", res.tempFilePaths, that,
        function (urls) {
            //传输成功
            wx.hideLoading({
              complete: (res) => {},
            })
            console.log("---start---" ,urls);

    
            // , urls
            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.addHandler("success", function (imgUrl) {
              tip.showTip("上传成功......");
              var postImg = "post.postImages["+index+"].imgUrl";
              that.setData({
                [postImg]:urls[0]
              })
              // that.isPostApproved();
            })
            httpClient.send(request.url.replaceImg, "GET",
              {
                pkId: that.data.pkId,
                postId: that.data.postId,
                imgUrl: urls[0],
                imgId: that.data.post.postImages[index].imageId
              }
            );
  
  
            // page.editImageDialog.success();
            // createLabelLoading(page).hide();
            // createLabelLoadingSuccess(page).show();
        },
        function () {
            
            //传输失败
            wx.hideLoading({
              complete: (res) => {
                tip.showContentTip("替换失败......");
              },
            })
            
  
        });
        
      },
    })
  },

  back:function(){wx.navigateBack({
    complete: (res) => {},
  })},




  editText:function () {
    var that = this;
    template.createEditTextDialog(that).show("修改内容", "编辑",that.data.post.topic, 120, function (text) {
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (post) {
      
    
                that.setData({
                  "post.topic":text
                })
    
              })
              httpClient.send(request.url.replaceText, "GET",
                {
                  pkId: that.data.pkId,
                  postId: that.data.postId,
                  text:text
                }
              );    



    });






  },


 


})