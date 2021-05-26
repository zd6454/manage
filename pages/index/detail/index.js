// pages/index/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     content:[
       {
       title:'第一网格负责人：测试1号->测试2号',
       author:'书记',
       content:'理工大东社区第一网格负责人换为测试2号，明日起生效',
       time:'2021-05-22'
     },
     {
      title:'6月3号全社区体检',
      author:'书记',
      content:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      time:'2021-05-22'
    },
    {
      title:'修剪草坪活动已结束',
      author:'书记',
      content:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      time:'2021-05-22'
    },
    ],
    item:{
      title:'',
      author:'',
      content:'',
      time:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {content} = this.data;
    console.log(options)
  if(options.id==='2'){
    this.setData({
      item:content[0]
    })
  }else if(options.id==='3'){
    this.setData({
      item:content[2]
    })
  }else{
    this.setData({
      item:content[1]
    })
  }
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

  }
})