var amapFile = require('../../../../libs/amap-wx.js');  //引入高德js
var config = require('../../../../libs/config.js');      //引用我们的配置文件
var key = config.Config.key;
Page({
  data: {
    longitude: '',
    latitude: '',
    detailStatus: false,
    status: '',
    markers: [],
    points: [],
    distance: '',
    cost: '',
    city: '',
    tips: {},
    polyline: [],
    activityPos:{}
  },
  onLoad(options) {
    var _this = this;
    wx.getLocation({
      success: function (res) {
        if (res && res.longitude) {
          _this.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            status:'walk',
            points: [{
              longitude: res.longitude,
              latitude: res.latitude
            }],
            markers: [{
              id: 0,
              longitude: res.longitude,
              latitude: res.latitude,
              // iconPath: '../../src/images/navi_s.png',
              width: 32,
              height: 32
            }]
          })
          _this.getLocation(options.activity_location)
        }
      }
    })
  },

  getLocation(activity_location){
    const that = this;
    wx.request({
      // url:'https://apis.map.qq.com/ws/geocoder/v1/?city=武汉&address='+activity_location?activity_location:'武汉理工大学东社区'+'&key=SB4BZ-NURKK-NFMJ6-A63LK-MXYIE-SEFZI',
      url:'https://apis.map.qq.com/ws/geocoder/v1/?city=武汉&address=武汉理工大学&key=SB4BZ-NURKK-NFMJ6-A63LK-MXYIE-SEFZI',
      // url: 'https://restapi.amap.com/v3/geocode/geo?key='+key+'&city=北京&address=北京市朝阳区阜通东大街6号',
      method:'GET',
      success(res) {
        console.log('成功',res.data.result.location);
        that.setData({activityPos:res.data.result.location})
        that.bindSearch()
      },
      fail(err) {
        console.log(err)
      }
    })

  },
  bindSearch: function () {
    // var keywords = e.target.dataset.keywords;
    const that = this;
    const {activityPos} = that.data;
    // var location = e.target.dataset.location;
    // console.log()
    // location = location.split(',');
    if (that.data.markers.length > 1 && that.data.points.length > 1){
      that.data.markers.pop();
      that.data.points.pop();
      that.setData({ polyline:[]});
    }
    var markers = that.data.markers;
    var points = that.data.points;
    markers.push({
      id: 0,
      longitude: activityPos.lng,
      latitude: activityPos.lat,
      // iconPath: '../../src/images/navi_e.png',
      width: 32,
      height: 32
    });
    points.push({
      longitude: activityPos.lng,
      latitude: activityPos.lat,
    })
    that.setData({
      markers: markers,
      points: points
    })
    this.goTo()
  },
  goTo(e) {
    if (this.data.points.length < 2) {
      wx.showToast({ title: '获取地理信息失败' ,icon:'none'})
      return;
    }
    var status = e?e.target.dataset.status:this.data.status;
    var myAmap = new amapFile.AMapWX({ key: key });

    switch (status) {
      case 'car':
        myAmap.getDrivingRoute(this.getDataObj('#4B0082'));
        break;
      case 'walk':
        myAmap.getWalkingRoute(this.getDataObj());
        break;
      case 'bus':
        myAmap.getTransitRoute(this.getBusData('#008B8B'));
        break;
      case 'ride':
        myAmap.getRidingRoute(this.getDataObj('#00FFFF'));
        break;
      default:
        return;
    }
    this.setData({
      detailStatus: true,
      status: status
    })
  },
  getDataObj(color) {
    var _this = this;
    var color = color || "#0091ff";

    return {
      origin: _this.data.points[0].longitude + ',' + _this.data.points[0].latitude,
      destination: _this.data.points[1].longitude + ',' + _this.data.points[1].latitude,
      success(data) {
        var points = [];
        if (!data.paths || !data.paths[0] || !data.paths[0].steps) {
          wx.showToast({ title: '失败！' });
          return;
        }
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        _this.setData({
          distance: data.paths[0].distance,
          cost: parseInt(data.paths[0].duration / 60),
          polyline: [{
            points: points,
            color: color,
            width: 6
          }]
        });
      },
      fail(info) {
        wx.showToast({ title: '失败！' })
      }
    }
  },
  getBusData(color) {
    var _this = this;
    var color = color || "#0091ff";

    return {
      origin: _this.data.points[0].longitude + ',' + _this.data.points[0].latitude,
      destination: _this.data.points[1].longitude + ',' + _this.data.points[1].latitude,
      city: _this.data.city,
      success(data) {
        var points = [], cost = 0;
        if (data && data.transits) {
          var transits = data.transits;
          for (var i = 0; i < transits.length; i++) {
            cost += parseInt(transits[i].duration);
            var segments = transits[i].segments;
            for (var j = 0; j < segments.length; j++) {
              if (segments[j].bus.buslines[0] && segments[j].bus.buslines[0].polyline) {
                var steps = segments[j].bus.buslines[0].polyline.split(';');
                for (var k = 0; k < steps.length; k++) {
                  var point = steps[k].split(',');
                  points.push({
                    longitude: point[0],
                    latitude: point[1]
                  })
                  if (parseInt(point[0] * 100000) === parseInt(_this.data.points[1].longitude * 100000) && parseInt(point[1] * 100000) === parseInt(_this.data.points[1].latitude * 100000)){
                    _this.setData({
                      distance: data.distance,
                      cost: parseInt(cost / 60),
                      polyline: [{
                        points: points,
                        color: color,
                        width: 6
                      }]
                    });
                    return ;
                  }
                }
              }
            }
          }
        }
      },
      fail(info) {
        wx.showToast({ title: '失败！' })
      }
    }
  }
})
