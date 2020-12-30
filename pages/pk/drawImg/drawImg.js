// pages/pk/drawImg/drawImg.js

const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
wx.createSelectorQuery()
const ctx = wx.createCanvasContext('myCanvas');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs:[{},{},{},{},{},{},{},{},{}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {




  },
  onReady:function(){
    var that = this;
    ctx.save()
    ctx.setFillStyle('white');//填充白色
    ctx.fillRect(0,0,vwPx * 100,vwPx * 100);//画出矩形白色背景
    ctx.restore()



    var drawImgs = wx.getStorageSync('drawImgs')
    that.setData({
      imgs:drawImgs
    })
    that.drawImg();
  
  },
  selectImg:function(res){
    var that = this;
    var index = parseInt(res.currentTarget.dataset.index);

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(file) {
     
        wx.getImageInfo({
          src: file.tempFilePaths[0],
          success:function(res){
            var imgW = res.width;
            var imgH = res.height;
            var x = imgW>imgH?(imgW-imgH)/2:0;
            var y = imgW>imgH?0:(imgH-imgW)/2;
    
            var size = imgW>imgH?imgH:imgW;
            var img = {x:x,y:y,size:size,url:file.tempFilePaths[0]};
            that.data.imgs[index-1] = img;
            that.setData({
              imgs:that.data.imgs
            })

            ctx.save()
            ctx.setFillStyle('white');//填充白色
            ctx.fillRect(0,0,vwPx * 100,vwPx * 100);//画出矩形白色背景
            ctx.restore()
            that.drawImg( );
          }
      })
        // that.drawImg( res.tempFilePaths[0],index);
        

      },
    })
  },






  drawImg:function(){
    var that = this;


    for(var i=0;i<9;i++){
        var img = that.data.imgs[i];
        if(img.url)
        {
              
              // var imgW = res.width;
              // var imgH = res.height;
              // var x = imgW>imgH?(imgW-imgH)/2:0;
              // var y = imgW>imgH?0:(imgH-imgW)/2;
              // var size = imgW>imgH?imgH:imgW;

              if(i === 0){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, 0, 0,vwPx*33, vwPx*33)}
              if(i === 1){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, vwPx*(33+0.5), 0,vwPx*33, vwPx*33)}
              if(i === 2){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, vwPx*(33 + 33 + 1), 0,vwPx*33, vwPx*33)}

              if(i === 3){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, 0, vwPx*(33+0.5),vwPx*33, vwPx*33)}
              if(i === 4){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, vwPx*(33+0.5), vwPx*(33+0.5),vwPx*33, vwPx*33)}
              if(i === 5){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, vwPx*(33 + 33 +1), vwPx*(33+0.5),vwPx*33, vwPx*33)}

              if(i === 6){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, 0, vwPx*(33 + 33 +1),vwPx*33, vwPx*33)}
              if(i === 7){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, vwPx*(33+0.5),vwPx*(33 + 33 +1),vwPx*33, vwPx*33)}
              if(i === 8){ctx.drawImage(img.url,img.x,img.y,img.size,img.size, vwPx*(33 + 33 + 1),vwPx*(33 + 33 +1),vwPx*33, vwPx*33)}

          
            
 

        }

    }
    ctx.draw()
    ctx.save();

  





  },


  save:function(){
    wx.showLoading({
      title: '生成图片',
    })


    wx.canvasToTempFilePath({ //裁剪对参数
      canvasId: "myCanvas",
      x: 0, //画布x轴起点
      y: 0, //画布y轴起点
      width: vwPx * 100, //画布宽度
      height:vwPx * 100, //画布高度
      // destWidth: image_width, //输出图片宽度
      // destHeight: image_height, //输出图片高度
      success: function (res) {
        console.log('图片处理成功了',res)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
        wx.hideLoading()
      },
      fail: function (e) {
        wx.hideLoading()
        wx.showToast({
          title: '出错啦...',
          icon: 'loading'
        })
      }
    })



  }
})