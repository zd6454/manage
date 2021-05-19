module.exports={
  'access-token': wx.getStorageSync('access-token'),
  'token-type': wx.getStorageSync('token-type'),
  client: wx.getStorageSync('client'),
  expiry: wx.getStorageSync('expiry'),
  uid: wx.getStorageSync('uid'),
}