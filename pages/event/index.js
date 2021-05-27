// pages/event/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList:[],
    searchList:[],
    currentPage:0,
    pageSize:10,
    totalList:0,
    haveMore:true,
    inputVal: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.getStorageSync('access-token')){
      wx.showToast({
        title: '请登录后查看',
        icon:'none'
      })
      return
    }
    this.getActivity()
    this.setData({
      search: this.search.bind(this)
  })
  },

    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {haveMore} = this.data;
    if(haveMore && inputVal==''){
      this.getActivity('all')
    }else{
      wx.showToast({
        title: '没有下一页了',
        icon:'none'
      })
    }
  },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   this.setData({activityList:[],searchList:[],currentPage:1,totalList:0,haveMore:true,inputVal: "",})
  // },

  search: function (value) {
    this.setData({inputVal:value})
    this.getActivity('filter')
  },

  cancelText:function(){
    this.setData({inputVal:'', activityList:[],currentPage:1,totalList:0,haveMore:true,})
    this.getActivity('all')
  },


  // 加载可参与活动列表
  getActivity (index){
      const that=this;
      wx.showLoading({
        title: '加载中',
      })
      const{currentPage,pageSize,totalList,activityList,inputVal} = that.data;
      let params = {}
      if(index == 'filter'){
        params={
          pageSize: 20,
          filter:{name:inputVal,status:1},
          current: 0,
        }
      }else{
        params={
          pageSize: pageSize,
          filter:{status:1},
          current: currentPage,
        }
      }
      
      wx.request({
        url: 'https://wuhanhszl.com:3000/users/activities',
        method: 'GET',
        data:params,
        header: {
          'Access-Token': wx.getStorageSync('access-token'),
          'Token-Type': wx.getStorageSync('token-type'),
          Client: wx.getStorageSync('client'),
          Expiry: wx.getStorageSync('expiry'),
          Uid: wx.getStorageSync('uid'),
        },
        getResponse: true,
        success(res){
          console.log('可加入的活动信息列表数据',res.data)
          if(res.data.success){
            wx.hideLoading({
              success: (res) => {},
            })
            const newTotalList = res.data.data.length+totalList
            if(newTotalList>=res.data.total){
              that.setData({haveMore:false})
            }else{
              that.setData({haveMore:true})
            }
            if(index == 'filter'){
              that.setData({searchList:res.data.data})
            }else{
              that.setData({activityList:[...activityList,...res.data.data],currentPage:currentPage+1,totalList:newTotalList})
            }
          }else{
            wx.hideLoading({
              success: (res) => {},
            })
            if(res.data.errors[0] == 'You need to sign in or sign up before continuing.'){
              wx.showModal({
                title:'请先登录',
                confirmText: "确定",
                confirmColor: "#ff1818",
              })
            }
          }
        },
        fail(err){
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showModal({
            title:'网络出现错误',
            confirmText: "确定",
            confirmColor: "#ff1818",
          })
        }
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
   * 页面上拉触底事件的处理函数
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})