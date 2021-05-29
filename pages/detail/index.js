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
    canSignIn:false,

    //设置当前完成步数
    steps: 2,

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

    src: "",
    who: "",
    openid: "",
    windowWidth: 0,
    canvasshow: true,
    access_token: '',

    register:0, //0未签到,1签到成功

    register_btn:true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({isJoin:options.isJoin==='true'})
    this.getActivity(options.activity_id);
    this.isActivityLoc()
  },

  isActivityLoc(){
    const that = this;
    wx.getLocation({
      success: function (res) {
        if (res && res.longitude) {
          that.getLocation(res)
        }
      }
    })
  },

  getLocation(nowPosition){
    const that = this;
    wx.request({
      // url:'https://apis.map.qq.com/ws/geocoder/v1/?city=武汉&address='+activity_location?activity_location:'武汉理工大学东社区'+'&key=SB4BZ-NURKK-NFMJ6-A63LK-MXYIE-SEFZI',
      url:'https://apis.map.qq.com/ws/geocoder/v1/?city=武汉&address=武汉理工大学&key=SB4BZ-NURKK-NFMJ6-A63LK-MXYIE-SEFZI',
      // url: 'https://restapi.amap.com/v3/geocode/geo?key='+key+'&city=北京&address=北京市朝阳区阜通东大街6号',
      method:'GET',
      success(res) {
        that.setData({canSignIn:true})
        const eventPosition = res.data.result.location;
        // console.log(nowPosition,eventPosition)
        if((eventPosition.lng<=nowPosition.longitude+0.0005&&eventPosition.lng>=nowPosition.longitude-0.0005||nowPosition.longitude<=eventPosition.lng+0.0005&&nowPosition.longitude>=eventPosition.lng-0.0005)
      &&(eventPosition.lat<=nowPosition.latitude+0.005&&eventPosition.lat>=nowPosition.latitude-0.005||nowPosition.latitude<=eventPosition.lay+0.005&&nowPosition.latitude>=eventPosition.lat-0.005)){
        that.setData({canSignIn:true})
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  handle_register(){
    this.setData({
      register_btn:false,
    })

    var that = this

    //屏幕宽度
    var sysInfo = wx.getSystemInfoSync()
    console.log("sysInfo", sysInfo)
    that.setData({
      windowWidth: sysInfo.windowWidth,
    })
    that.ctx = wx.createCameraContext()

    this.track();
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
      url: 'https://api.linyunkuaixiu.cn:8006/activities/' + activity_id +'/participant',
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
      url: 'https://api.linyunkuaixiu.cn:8006/activities/'+activity_id,
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
          // steps: activity_data.status,
          steps:2,
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
    if(this.data.content == null){
      wx.showModal({
        title:'总结不能为空',
        confirmText: "确定",
        confirmColor: "#ff1818",
      })
    }
    console.log('img',this.data.content)
    let formatData = {
      "content": this.data.content,
      // "img":this.data.imgs.tempFilePaths[0],
      "img": this.data.imgs[0],
    }
    console.log(formatData);

    let that = this;
    wx.request({
      url: 'https://api.linyunkuaixiu.cn:8006/activities/' + that.data.activity_id +'/report',
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
  },

  track() {
    this.setData({
      canvasshow: true
    })
    this.takePhoto();
    this.interval = setInterval(this.takePhoto, 500);
  },

  async takePhoto() {
    console.log("takePhoto")
    var that = this
    var takephonewidth
    var takephoneheight
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        // console.log(res.tempImagePath),
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth = res.width,
            takephoneheight = res.height
          }
        })
        // console.log(takephonewidth, takephoneheight)
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data),
            wx.request({
              url: "https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=24.a02ba5d76d3dc462e94baa37834033ee.2592000.1623984166.282335-23796596",
              data: {
                image: res.data,
                image_type: "BASE64",
                max_face_num: 10
              },
              method: 'POST',
              dataType: "json",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                if (res.data.error_code === 0) {
                  var ctx = wx.createContext()
                  ctx.setStrokeStyle('#31859c')
                  ctx.lineWidth = 3
                  for (let j = 0; j < res.data.result.face_num; j++) {
                    var cavansl = res.data.result.face_list[j].location.left / takephonewidth * that.data.windowWidth
                    var cavanst = res.data.result.face_list[j].location.top / takephoneheight * that.data.windowWidth
                    var cavansw = res.data.result.face_list[j].location.width / takephonewidth * that.data.windowWidth
                    var cavansh = res.data.result.face_list[j].location.height / takephoneheight * that.data.windowWidth
                    ctx.strokeRect(cavansl, cavanst, cavansw, cavansh)
                  }
                  wx.drawCanvas({
                    canvasId: 'canvas',
                    actions: ctx.getActions()
                  })
                } else {
                  var ctx = wx.createContext()
                  ctx.setStrokeStyle('#31859c')
                  ctx.lineWidth = 3
                  wx.drawCanvas({
                    canvasId: 'canvas',
                    actions: ctx.getActions()
                  })
                }

                clearInterval(that.interval);
                that.search()
              },
            })
          }
        })
      }
    })
  },

  search() {
    let result = false;
    console.log('search')
    var that = this
    that.setData({
      who: ""
    })
    var takephonewidth
    var takephoneheight
    that.ctx.takePhoto({
      quality: 'heigh',
      success: (res) => {
        // console.log(res.tempImagePath),
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth = res.width,
            takephoneheight = res.height
          }
        })
        that.setData({
          src: res.tempImagePath
        }),
          wx.getFileSystemManager().readFile({
            filePath: that.data.src, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => {
              wx.request({
                url: "https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=24.a02ba5d76d3dc462e94baa37834033ee.2592000.1623984166.282335-23796596'",
                data: {
                  image: res.data,
                  image_type: "BASE64",
                  group_id_list: "users",
                },
                method: 'POST',
                dataType: "json",
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res.data);
                  if (res.data.result &&
                  res.data.result.user_list.length > 0 &&
                  res.data.result.user_list[0].score > 90){
                      that.setData({
                        register: 1,
                      })
                  } else {

                    wx.showToast({
                      title: '人脸识别失败,请重新签到',
                      icon: 'none',
                      duration: 3000
                    })

                    that.setData({
                      register_btn: true,
                    })
                  }
                  
                },
              })
            }
          })
      }
    })

    return result;

  },

  onUnload: function () {
    var that = this
    clearInterval(that.interval)
  },

  error(e) {
    console.log(e.detail)
  },

  submitParticipation(){
    let that = this;
    wx.showModal({
      title: '申请确认',
      content: '是否确定申请加入活动？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.request({
            url: 'https://api.linyunkuaixiu.cn:8006/activities/' + that.data.activity_id + '/register',
            method: 'POST',
            header: {
              'access-token': wx.getStorageSync('access-token'),
              'token-type': wx.getStorageSync('token-type'),
              client: wx.getStorageSync('client'),
              expiry: wx.getStorageSync('expiry'),
              uid: wx.getStorageSync('uid'),
            },
            credentials: 'omit',
            success(res) {
              console.log(res);
              if (res.data.success==false){
                console.log("加入失败！")
              } else {
                wx.showToast({
                  title: '加入成功',
                  icon: 'succes',
                  duration: 2000,
                  mask: true
                })
              }

            },
            fail(err) {
              console.log(err)
            }
          })

        } else {
          console.log('用户点击取消')
        }

      }
    })
    
  }

})