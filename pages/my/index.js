// pages/my/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
   ops:{},
   userInfo:{},
   pieData:null,
   columnData:null,
   address:'',
   gender:'../../icons/man.png',
   avatar:'../../icons/avatar.png',
   birth:'',
   isLogin:false,
   tabs:[{title: '正在进行',}, { title: '历史活动',},{ title: '数据统计',},],
   activeTab: 0,
   eventsIng:[],
   eventsAll:[],
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
     header: {
      'Access-Token': wx.getStorageSync('access-token'),
      'Token-Type': wx.getStorageSync('token-type'),
      Client: wx.getStorageSync('client'),
      Expiry: wx.getStorageSync('expiry'),
      Uid: wx.getStorageSync('uid'),
     },
     credentials: 'omit',
    success(res){
      if(res.data){
        const gender=res.data.gender==='女'?"../../icons/woman.png":'../../icons/man.png';
        const{location} = res.data;
        const address=location.area+location.building+'栋'+location.unit+'单元'+location.number+'号';
        that.setData({isLogin:true,userInfo:res.data,gender,address})
        that.getAvaityTime('user_activity_types')
        that.getAvaityTime('user_month_hours')
        that.getAllEvents()
        setTimeout(()=>{
            that.setOps()
        },500)
      }
    },
   })
  },
  
  handleTime  (timeData)  {
    const children = Object.keys(timeData);
    const data = [];
    for (let i = 0; i < children.length; i += 1) {
      const item = {
        name: children[i].slice(0, 7),
        value: timeData[children[i]],
      };
      data.push(item);
    }
    return data;
  },
  handleEvents(data){
     let eventsAll=[],eventsIng=[];
      for(let i=0;i<data.length;i++ ){
        if(data[i].status<=3){
          eventsIng.push(data[i])
        }else{
          eventsAll.push(data[i])
        }
      }
     this.setData({eventsAll,eventsIng})
  },
  //获取历史活动
  getAllEvents(){
    let that = this;
   wx.request({
     url: 'https://wuhanhszl.com:3000/users/activities',
     method: 'GET',
     credentials: 'omit',
     skipErrorHandler: true,
     params: {
      pageSize:  5,
      filter: {  },
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
    that.handleEvents(res.data.data)
     }
   })
  },


  //获取统计数据
  getAvaityTime(type){
    let that=this;
    const{id} = this.data.userInfo;
   wx.request({
     url: `https://wuhanhszl.com:3000/analysis/${type}?id=${id}`,
     method: 'GET',
     credentials: 'omit',
     success(res){
       if(type==='user_month_hours'){
          const data = that.handleTime(res.data);
          that.setData({
            columnData:data
          })
       }else{
       that.setData({
         pieData:res.data
       })
       }

     }
   })
  },

  onTabClick(e) {
    const index = e.detail.index
    if(index===2){
    }
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
  toeditinfo(){
    wx.navigateTo({
      url: './info/index',
    })
  },
 setOps(){
   const{pieData,columnData}=this.data;
   const monthList = columnData.map((item) => {
    return item.name;
  });
  const activityNumber = columnData.map((item) => {
    return item.value;
  });
  this.setData({
    ops: {
      title: {
        text: '党员个人参与活动类型比例',
        subtext: null,
        x: 'center',
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} {b} : {c} ({d}%)',
      },
      series: [
        {
          name: '活动次数',
          type: 'pie',
          radius: '40%',
          center: ['50%', '60%'],
          data: [
            { value: pieData['安全巡逻'], name: '安全巡逻' },
            { value:pieData['文体活动'], name: '文体活动' },
            { value: pieData['宣传教育'], name: '宣传教育' },
            { value:pieData['关爱帮扶'], name: '关爱帮扶' },
            { value:pieData['数据搜集整理'], name: '数据搜集整理' },
            { value: pieData['新闻宣传'], name: '新闻宣传' },
            { value: pieData['心理法律咨询'], name: '心理法律咨询' },
            { value: pieData['应急'], name: '应急' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            normal: {
              color(params) {
                // 自定义颜色
                const colorList = [
                  '#ffccc7',
                  '#ffa39e',
                  '#ff7875',
                  '#ff4d4f',
                  '#f5222d',
                  '#cf1322',
                  '#a8071a',
                  '#820014',
                  '#5c0011',
                ];
                return colorList[params.dataIndex];
              },
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)',
              },
              labelLine: { show: true },
            },
          },
        },
      ],
    },
    ops2:{
      title: {
        text: '党员个人近6月参与活动次数',
        x: 'center',
      },
      yAxis: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true
      },
      legend: {},
      xAxis: {
        data: monthList,
      },
      series: [
        {
          name: '',
          type: 'bar',
          data: activityNumber,
          barWidth: 15,
          itemStyle: {
            normal: {
              color() {
                return '#ff4d4f';
              },
            },
          },
        },
      ],
    }
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
    this.getUser();
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
    this.getUser();
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