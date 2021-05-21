// pages/my/components/eventsList/inde.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    data:{
      type:Array,
      value:[
        {
        time:'2021-01-01',
        author:'wxz',
        title:'打扫草地',
        avatar:'',
        statu:'已结束',
      },
      {
        time:'2021-01-01',
        author:'wxz',
        title:'打扫草地',
        avatar:'',
        statu:'已结束',
      },
    ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status:['待审核','未开始','进行中','已完成','反馈中','已结束','已驳回','已作废']
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
