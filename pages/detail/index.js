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


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.activity_id);
    this.getActivity(options.activity_id);
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


      },
      fail(err) {
        console.log(err)
      }
    })
  },
})