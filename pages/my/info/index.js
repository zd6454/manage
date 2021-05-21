// pages/my/info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    userInfo:{},
    location:{},
    content:{
      1:'name',
      4:'unit',
      8:'organization_id',
      9:'area',
      10:'building',
      11:'unit',
      12:"number"
    }
  },
//初始化用户信息
  getUser(){
    let that=this;
   wx.request({
     url: 'https://api.linyunkuaixiu.cn:8006//users',
     method: 'GET',
     header:{
      'access-token': wx.getStorageSync('access-token'),
      'token-type': wx.getStorageSync('token-type'),
      client: wx.getStorageSync('client'),
      expiry: wx.getStorageSync('expiry'),
      uid: wx.getStorageSync('uid'),
     },
     credentials: 'omit',
    success(res){
      const birth=(res.data.birth+"").slice(0,10);
      const{location} = res.data;
      const address=location.area+location.building+'栋'+location.unit+'单元'+location.number+'号';
      const tags=res.data.tags.map((item)=>item.name)
      const items=[
        {myinfo:"党员头像",content:res.data.avatar},
      {myinfo:"党员姓名",content:res.data.name},
      {myinfo:"性别",content:res.data.gender},
      {myinfo:"教育水平",content:res.data.education_lvl},
      {myinfo:"工作单位",content:res.data.unit},
      {myinfo:"出生年月",content:birth},
      {myinfo:"入党时间",content:res.data.enter_party_time},
      {myinfo:"党员专长",content:tags},
      {myinfo:"所属组织",content:res.data.organization},
      {myinfo:"地址",content:address},
      {myinfo:"楼栋",content:res.data.location.building+'栋'},
      {myinfo:"单元",content:res.data.location.unit+'单元'},
      {myinfo:"门牌号",content:res.data.location.number+'号'},
      ]
      const userInfo={
        birth: res.data.birth,
        education_lvl: res.data.education_lvl,
        enter_party_time:res.data.enter_party_time,
        gender: res.data.gender,
        name: res.data.name,
        organization_id: res.data.organization_id,
        unit: res.data.unit,
      }
      const location2={
        area: res.data.location.area,
        building: res.data.location.building,
        number:res.data.location.number,
        unit: res.data.location.unit,
      }
     that.setData({items,userInfo,location:location2})
    },
    fail(err){
    console.log(err)
    }
   })
  },
 //更新信息接口
  updateInfo(user_info, location){
    const formData = {};
    formData.user_info = user_info;
    formData.location = location;
    wx.request({
     url: 'https://api.linyunkuaixiu.cn:8006/users/',
     method: 'POST',
     credentials: 'omit',
     data: formData,
     header:{
      'access-token': wx.getStorageSync('access-token'),
      'token-type': wx.getStorageSync('token-type'),
      client: wx.getStorageSync('client'),
      expiry: wx.getStorageSync('expiry'),
      uid: wx.getStorageSync('uid'),
     },
     success(res){
      console.log(res);
     },
     fail(err){
     console.log(err)
     }
   })
  },
  //更新头像接口
  updateAvatar(img){
    const img2 = new FormData();
  img2.append('img', img);
   wx.request({
     url: 'https://api.linyunkuaixiu.cn:8006/users/change_avatar',
     method: 'POST',
     header:{
      'access-token': wx.getStorageSync('access-token'),
      'token-type': wx.getStorageSync('token-type'),
      client: wx.getStorageSync('client'),
      expiry: wx.getStorageSync('expiry'),
      uid: wx.getStorageSync('uid'),
     },
     data:img2,
     success(res){
     console.log(res)
     },
    fail(errs){
    wx.showToast({
      title: '修改失败',
    })
    }
   })
  },
  //头像修改
  changeAvatar(){
    var  _this = this;
    let {items} = this.data;
    wx.chooseImage({
      count: 1, // 默认9     
      sizeType: ['original', 'compressed'],
     // 指定是原图还是压缩图，默认两个都有     
      sourceType: ['album', 'camera'],
     // 指定来源是相册还是相机，默认两个都有   
      success: function (res) {   
        items[0].content=res.tempFilePaths[0];
        console.log(res)
        _this.setData({
          items,
       })
       _this.updateAvatar(res.tempFilePaths[0])
     }
   })
  },
 //时间修改
  fixchange(e){
    const {value} = e.detail;
    const {index} = e.currentTarget.dataset;
    let {items,userInfo,location}=this.data;
    const item = index===5?'birth':'enter_party_time';
    userInfo[item] = value;
    items[index].content=value;
    this.setData({userInfo,items});
    this.updateInfo(userInfo,location)
  },
  //其他修改
  fixone(e){
    const {index} = e.currentTarget.dataset;
    const that = this;
    let {userInfo,location,items,content} = this.data;
    if(index===2||index===3){
      const item =index===2? ['男','女']:['大专','本科','硕士研究生','博士','博士后'];
      wx.showActionSheet({
      itemList: item,
      success (res) {
        if(index===2){
           userInfo.gender=item[res.tapIndex]
        }else{
          userInfo.education_lvl=item[res.tapIndex]
        }
        items[index].content=item[res.tapIndex];
        that.setData({userInfo,items})
        that.updateInfo(userInfo,location)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
   }else if(index!==5&&index!==6&&index!==0){
     wx.navigateTo({
       url: `../edit/index?content=${items[index].myinfo}&name=${content[index]}&item=${items[index].content}`,
     })
   }
  },
  changePassword(){
   wx.navigateTo({
     url: '../password/index',
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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