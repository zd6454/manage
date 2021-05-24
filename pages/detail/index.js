// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_name:"修剪草坪",
    activity_id:0,
    activity_description:"xxx",
    activity_category: "xxx",
    activity_location: "xxx",
    authorized_time: "xxx",
    activity_authorizer: "xxx",
    created_at: "xxx",
    activity_date: "xxx",
    activity_director: "xxx",
    participantInfo:null,
    content:null,

    //设置当前完成步数
    steps: 0,

    // 当步骤为五步时步骤名不可超过五个汉字
    stepsList: ["预案审核", "开始报名", "活动进行", "活动完成", "活动结束"],
    //步骤为五步时
    progress: 80,
    percent: 25,
    // //步骤为四步时
    //   progress: 75,
    //   percent: 33,
    // //步骤为三步时
    //   progress: 67,
    //   percent: 50,

    imgs: [],
    count: 1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.activity_id);
    this.getActivity(options.activity_id);
  },

  gotoRoutePlanning(){
    const {activity_location} = this.data;
    wx.navigateTo({
      // url: '../../../../detail/index?activity_id='+e.currentTarget.dataset.item.id,
      url:'./components/routePlanning/index?activity_location='+activity_location
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取反馈信息
  getParticipants(activity_id) {
    let that = this;
    wx.request({
      url: 'https://wuhanhszl.com:3000/activities/' + activity_id +'/participant',
      method: 'GET',
      header: {
        'access-token': wx.getStorageSync('access-token'),
        'token-type': wx.getStorageSync('token-type'),
        client: wx.getStorageSync('client'),
        expiry: wx.getStorageSync('expiry'),
        uid: wx.getStorageSync('uid'),
      },
      credentials: 'omit',
      success(res) {
        console.log(res.data);
        that.setData({
          participantInfo: res.data,
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },



  //初始化活动信息
  getActivity(activity_id) {
    let that = this;
    wx.request({
      url: 'https://wuhanhszl.com:3000/activities/'+activity_id,
      method: 'GET',
      header: {
        'access-token': wx.getStorageSync('access-token'),
        'token-type': wx.getStorageSync('token-type'),
        client: wx.getStorageSync('client'),
        expiry: wx.getStorageSync('expiry'),
        uid: wx.getStorageSync('uid'),
      },
      credentials: 'omit',
      success(res) {
        console.log(res.data);
        let activity_data = res.data;
        that.setData({
          activity_id:activity_data.id,
          activity_name: activity_data.name,
          activity_category: activity_data.category,
          activity_description: activity_data.description,
          activity_location: activity_data.location,
          authorized_time: activity_data.authorized_time,
          activity_authorizer: activity_data.authorizer,
          created_at:activity_data.created_at,
          activity_date: activity_data.date,
          activity_director: activity_data.director,
          steps: activity_data.status,
        });

        if (activity_data.status==3){
          that.getParticipants(activity_data.id)
        }


      },
      fail(err) {
        console.log(err)
      }
    })
  },

  getDataBindTap: function (e) {
    var result = e.detail.value;

    this.setData({
      content:result,
    })

  },

  submit_report: function(){
    let formatData = {
      "content": this.data.content,
      "img":this.data.imgs[0],
    }
    console.log(formatData);

    let that = this;
    wx.request({
      url: 'https://wuhanhszl.com:3000/activities/' + that.data.activity_id +'/report',
      method: 'POST',
      data:formatData,
      header: {
        'access-token': wx.getStorageSync('access-token'),
        'token-type': wx.getStorageSync('token-type'),
        client: wx.getStorageSync('client'),
        expiry: wx.getStorageSync('expiry'),
        uid: wx.getStorageSync('uid'),
      },
      credentials: 'omit',
      success(res) {
        console.log(res.data);

        that.setData({
          participantInfo: { feedback: '1', confirmed: false, reject_reason: null }
        })
        
      },
      fail(err) {
        console.log(err)
      }
    })


  },

  bindUpload: function (e) {
    console.log(e);
    switch (this.data.imgs.length) {
      case 0:
        this.data.count = 3
        break
      case 1:
        this.data.count = 2
        break
      case 2:
        this.data.count = 1
        break
    }
    var that = this
    wx.chooseImage({
      count: that.data.count, // 默认3
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log('res',res);
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgs: {tempFilePaths} //创建一个object URL，并不是你的本地路径
        })

        // for (var i = 0; i < tempFilePaths.length; i++) {
        //   wx.uploadFile({
        //     url: 'https://graph.baidu.com/upload',
        //     filePath: tempFilePaths[i],
        //     name: "file",
        //     header: {
        //       "content-type": "multipart/form-data"
        //     },
        //     success: function (res) {
        //       if (res.statusCode == 200) {
        //         wx.showToast({
        //           title: "上传成功",
        //           icon: "none",
        //           duration: 1500
        //         })

        //         that.data.imgs.push(JSON.parse(res.data).data)

        //         that.setData({
        //           imgs: that.data.imgs
        //         })
        //       }
        //       console.log("imgs", that.data.imgs)
        //     },
        //     fail: function (err) {
        //       wx.showToast({
        //         title: "上传失败",
        //         icon: "none",
        //         duration: 2000
        //       })
        //     },
        //     complete: function (result) {
        //       console.log(result.errMsg)
        //     }
        //   })
        // }
      }
    })

  },
  // 删除图片
  deleteImg: function (e) {
    var that = this
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
          for (var i = 0; i < that.data.imgs.length; i++) {
            if (i == e.currentTarget.dataset.index) that.data.imgs.splice(i, 1)
          }
          that.setData({
            imgs: that.data.imgs
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  }


})