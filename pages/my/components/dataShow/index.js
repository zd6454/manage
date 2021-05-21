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
      value: {},
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
