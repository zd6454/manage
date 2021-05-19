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
  login(){
    const that=this;
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
        const { header } = res;
        wx.setStorageSync('access-token', header['access-token']);
        wx.setStorageSync('token-type', header['token-type']);
        wx.setStorageSync('client', header['client']);
        wx.setStorageSync('expiry', header['expiry']);
        wx.setStorageSync('uid', header['uid']);
        wx.showToast({
          title: '登录成功',
        })
        that.backToMy();
        }else{
          wx.showModal({
            title:'账号或密码错误！',
            confirmText: "确定",
            confirmColor: "#ff1818",
          })
          that.setData({name:'',password:''})
        }
      },
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
