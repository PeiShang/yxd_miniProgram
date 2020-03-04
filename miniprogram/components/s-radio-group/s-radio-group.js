// components/s-radio-group.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles: {
      type: Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current_index : 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    radioChange(event){
      const index = event.detail.value;
      this.setData({
        current_index :index
      });

      //发出事件
      const data = {index: this.data.current_index};
      this.triggerEvent("radioChange", data, {})
    }
  }
})
