// pages/my/password/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     password1:'',
     password2:'',
  },

  getpasswork(e){
   this.setData({password1:e.detail.value})
  },
  getpasswork2(e){
   this.setData({password2:e.detail.value})

  },
  comfirm(){
   const{password1,password2}=this.data;
   if(password1!==password2){
     wx.showModal({
       title:'两次密码不一致，请确认',
       confirmText: "确定",
       confirmColor: "#ff1818",
     })
   }else{
    const formData = {
      password: password1,
      confirm_password: password2,
    };
     wx.request({
       url: 'https://api.linyunkuaixiu.cn:8006/users/password',
       method: 'POST',
       header:{
        'access-token': wx.getStorageSync('access-token'),
        'token-type': wx.getStorageSync('token-type'),
        client: wx.getStorageSync('client'),
        expiry: wx.getStorageSync('expiry'),
        uid: wx.getStorageSync('uid'),
       },
       data: formData,
       credentials: 'omit',
       success(res){
        if(res.data.success){
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '../info/index',
            })
          },500)
        }else{
          wx.showModal({
            title:'修改失败，请确认',
            confirmText: "确定",
            confirmColor: "#ff1818",
          })
        }
       }
     })
   }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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