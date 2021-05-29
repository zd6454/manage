// pages/my/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     name:'', 
     value:'',
     isCheck:false,
     items: [],
      one:[],
      two:[],
      three:[],
      treeId:0,
  },
  backTo(){
    wx.showToast({
      title: '修改成功',
    })
    wx.navigateBack({
      delta: 1,
    })
  },
 //更新信息接口
 updateInfo(user_info, location){
   let that=this;
  const formData = {};
  if(user_info){
     formData.user_info = user_info;
  }
  if(location){
    formData.location = location;
  }
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
     if(res.data.success){
        that.backTo()
     }else{
      wx.showToast({
        title: '修改失败',
      })
     }
    
    console.log(res);
   },
   fail(err){
   console.log(err)
   }
 })
},
 updateTags(params){
   let that=this;
  wx.request({
    url: 'https://api.linyunkuaixiu.cn:8006//users/update_tags',
    method: 'POST',
    header:{
      'access-token': wx.getStorageSync('access-token'),
      'token-type': wx.getStorageSync('token-type'),
      client: wx.getStorageSync('client'),
      expiry: wx.getStorageSync('expiry'),
      uid: wx.getStorageSync('uid'),
     },
    credentials: 'omit',
    data: { tags: JSON.stringify(params) },
    success(res){
    if(res.data.success){
      that.backTo()
    }else{
      wx.showToast({
        title: '修改失败',
      })
    }
    }
  })
 },
  comfirm(){
   const{value,content,name,items,treeId}=this.data;
   const userinfo={};
   const locationg={};
   if(name==='党员专长'){
     const tags=[];
     for(let i=0;i<items.length;i++){
        if(items[i].checked){
          tags.push(items[i].id)
        }
     }
     this.updateTags(tags)
   }else if(name==='所属组织'){
    this.updateInfo({organization_id:treeId},locationg)
   } else {
        if(name==='党员姓名'||name==='工作单位'){
          userinfo[content]=value;
        }else{
          locationg[content]=value
        }
        this.updateInfo(userinfo,locationg)
   }

  },

  getValue(e){
    const{value} = e.detail;
    this.setData({value})
  },

  //多选框
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    const values = e.detail.value
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }
    this.setData({
      items
    })
  },

  //tree
  first(e){
   console.log(e)
  },
  treeChange(e){
   console.log(e)
   const{value}=e.detail;
   const {trees}=this.data;
   const one=trees.children;
   const two=trees.children[value[0]].children;
   const three=trees.children[value[0]].children[value[1]].children;
   let treeId=336;
   if(three){
    treeId= three[value[2]].value;
   }else{
      treeId=two[value[1]].value;
   }
   this.setData({one,two,three,treeId})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options);
   const{name,content,item}=options;
   if(content==='党员专长'){
     this.getTags(item)
   }else if(content==='所属组织'){
    this.getTree()
   }
   this.setData({name:content,content:name,isCheck:content==='党员专长',isTree:content==='所属组织'})
  },

  //获取tags
  getTags(item){
    let that = this;
    wx.request({
      url: 'https://api.linyunkuaixiu.cn:8006//tags?pageSize=20&current=0',
      method: 'GET',
      credentials: 'omit',
      success(res){
      const items =  res.data.data.map((tag)=>{
             if(item.includes(tag.name)){
               tag.checked=true;
             }
             tag.value=tag.name;
             return tag;
      })
       that.setData({items})
      }
    })
  },

  getTree(){
    let that = this;
    wx.request({
      url: 'https://api.linyunkuaixiu.cn:8006/user_info/tree',
      method: 'GET',
      credentials: 'omit',
      success(res){
        console.log(res)
      const trees = that.transferOrgTree(res.data)
      const one=trees.children;
      const two=trees.children[0].children;
      const three=trees.children[0].children[0].children;
      that.setData({trees,isTree:true,one,two,three})
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
  transferOrgTree  (data)  {
    const newData = data;
    newData.label = newData.name;
    newData.value = newData.id;
    if (newData.children.length > 0) {
      newData.children.forEach((item) => this.transferOrgTree(item));
    }
    Object.keys(newData).forEach((item) => {
      if (item !== 'label' && item !== 'value' && item !== 'children') delete newData[item];
      if (item === 'children' && newData[item].length === 0) {
        delete newData[item];
      }
    });
    return newData;
  },
})