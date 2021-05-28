// pages/my/components/dataShow/index.js
import * as echarts from '../../../../ec-canvas/echarts';
let ops = null
let ops2 = null

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ops: {
      type: Object,
      value: {
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
              { value: 0, name: '安全巡逻' },
              { value: 0, name: '文体活动' },
              { value: 0, name: '宣传教育' },
              { value: 0, name: '关爱帮扶' },
              { value: 0, name: '数据搜集整理' },
              { value: 0, name: '新闻宣传' },
              { value: 0, name: '心理法律咨询' },
              { value: 0, name: '应急' },
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
      observer: function (newVal, oldVal) {
        // 属性值变化时执行 
        ops = newVal
        this.setData({
          ec: {
            onInit: this.initChart
          }
        })
      }
    },
    ops2:{
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        // 属性值变化时执行 
        ops2 = newVal
        this.setData({
          ex: {
            onInit: this.initChart2
          }
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: null,
    ex:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
   initChart(canvas, width, height, dpr) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      chart.setOption(ops);
      return chart;
    },
    initChart2(canvas, width, height, dpr) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      chart.setOption(ops2);
      return chart;
    },
  }
})
