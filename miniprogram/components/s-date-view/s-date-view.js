// components/s-date-view/s-date-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date:{
      type: String,
      value: ""
    },

    startTime: {
      type: String,
      value: "00:00"
    },

    endTime: {
      type: String,
      value: "24:00"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick() {
      console.log('Date click: ' + this.data.date)
    }
  }
})
