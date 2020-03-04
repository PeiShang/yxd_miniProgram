// components/s-swiper-content/s-swiper-content.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    title: {
      type: String,
      value: ""
    },

    date: {
      type: String,
      value: ""
    },

    desc: {
      type: String,
      value:""
    },

    url: {
      type: String,
      value:""
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
    handleItemClick(){
      console.log('Item click: '+this.data.title)
    }
  }
})
