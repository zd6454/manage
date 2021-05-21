//index.js
Page({
  data: {
  isLogin:false,
  name:"",
  password:"",
  },
  getname(e){
    const name=e.detail.value;
    this.setData({ name:name })
  },
  getpasswork(e){
    const password=e.detail.value;
    this.setData({password:password})
  },
  onlogin(){
    const that=this;
    wx.showLoading({
      title: '正在登录中',
    })
    const{name,password} = that.data;
    wx.request({
      url: 'https://api.linyunkuaixiu.cn:8006//user_auth/sign_in',
      method: 'POST',
      header: {
        'login': name,
        'password': password,
      },
      getResponse: true,
      success(res){
        console.log(res)
        if(res.data.data){
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(res)
        const { header } = res;
        wx.setStorageSync('access-token', header['access-token']);
        wx.setStorageSync('token-type', header['token-type']);
        wx.setStorageSync('client', header['client']);
        wx.setStorageSync('expiry', header['expiry']);
        wx.setStorageSync('uid', header['uid']);
        wx.showToast({
          title: '登录成功',
        })
        setTimeout(()=>{
        that.backToMy();
        },500)
        }else{
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showModal({
            title:'账号或密码错误！',
            confirmText: "确定",
            confirmColor: "#ff1818",
          })
          that.setData({name:'',password:''})
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
  backToMy(){
 wx.switchTab({
  url: '../my/index',
})
  },
  onLoad: function () {
  
  },
  
})
