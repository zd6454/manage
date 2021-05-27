// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    list:[],
   list2:[
     {  avatar:'../../icons/inform.png',director_name:'书记',date:'2021-05-22',type:'负责人',name:'第一网格负责人:测试1号->测试2号'},
     {  avatar:'../../icons/inform.png',director_name:'书记',date:'2021-05-22',type:'最新通报',name:'6月3号全社区体检'},
     {  avatar:'../../icons/inform.png',director_name:'书记',date:'2021-05-20',type:'活动结束',name:'修剪草坪活动已结束'},
   ],
   
  },

  handleevents(events){
    const{list,list2}=this.data;
    list2.map((item)=>{
    list.push(item)
    
    })
   events.map((item)=>{
     item.date=item.date.slice(0,10)
     item.avatar='../../icons/inform.png',
     item.type='发布活动'
     list.push(item)
     return item;
   })

   this.setData({list})
  },
  getAllEvents(){
    let that = this;
   wx.request({
     url: 'https://api.linyunkuaixiu.cn:8006//activities',
     method: 'GET',
     credentials: 'omit',
     skipErrorHandler: true,
     params: {
      pageSize:  5,
      filter: { status:'1' },
      current: 0,
     },
     header: {
      'Access-Token': wx.getStorageSync('access-token'),
      'Token-Type': wx.getStorageSync('token-type'),
      Client: wx.getStorageSync('client'),
      Expiry: wx.getStorageSync('expiry'),
      Uid: wx.getStorageSync('uid'),
     },
     success(res){
      that.handleevents(res.data.data.slice(0,5))
     }
   })
  },
  toDetail(e){
    console.log(e)
    const {item} = e.currentTarget.dataset;
    let url='';
    if(item.type==="发布活动"){
     url=`../detail/index?activity_id=${item.id}`
    }else{
      if(item.type==='负责人'){
        url='./detail/index?id=2'
      }else if(item.type==='活动结束'){
          url='./detail/index?id=3'
      }else{
        url='./detail/index'
      }
    }
   wx.navigateTo({
     url: url,
   })
  },
 onLoad(options){
  this.getAllEvents()
 },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getAllEvents()
  },
})
