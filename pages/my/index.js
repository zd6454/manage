// pages/my/index/index.js
import header from'../../utils/getHerder';
Page({

  /**
   * 页面的初始数据
   */
  data: {
   userInfo:{},
   address:'',
   gender:'../../icons/man.png',
   avatar:'../../icons/avatar.png',
   birth:'',
   isLogin:false,
   tabs:[
    {
      title: '正在进行',
    },
    {
      title: '历史活动',
    },
    {
      title: '数据统计',
    },
   ],
   activeTab: 0,
   },
   onlogin(){
   wx.navigateTo({
     url: '../login/index',
   })
  },
  getUser(){
    let that=this;
   wx.request({
     url: 'https://api.linyunkuaixiu.cn:8006//users',
     method: 'GET',
     header: header,
     credentials: 'omit',
    success(res){
      const birth=(res.data.birth+"").slice(0,10);
      const gender=res.data.gender==='女'?"../../icons/woman.png":'../../icons/man.png';
      const{location} = res.data;
      const address=location.area+location.building+'栋'+location.unit+'单元'+location.number+'号';
     that.setData({isLogin:true,userInfo:res.data,birth,gender,address})
    },
   })
  },
  
  onTabClick(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })
  },
  handleClick(e) {
    wx.navigateTo({
      url: './webview',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  this.getAvatar();
    this.getUser();
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