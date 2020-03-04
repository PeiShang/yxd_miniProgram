// miniprogram/pages/home/home.js

var MAX_NOTIFI = 3; //最大通知数量
const scales = ["national", "province", "city"];
const types = ["confirmed", "cure", "death"]
var wxCharts = require('../../utils/wxcharts.js');

Page({
  data: {
    banners: [], //轮播图数据
    total: [], //总量数据
    increment: [], //增量数据
    totalDetail: [],
    totalNum: 0,
    totalTitles: ["轻症", "重症", "死亡", "治愈"],
    currentScale: "national",
    currentType: "confirmed",
    currentDate: "",
    currentScale: "national",
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const db = wx.cloud.database();
    this._getPeriodData(db);
    this._getBannersData(db);
  },

  // -----------------网络请求函数-------------------------- 

  //获取banner数据
  _getBannersData(db) {
    db.collection("Notifications").limit(MAX_NOTIFI).get().then(res => {
      this.setData({
        banners: res.data
      })
    });
  },

  //获取当日数据
  _getPeriodData(db) {
    db.collection("Period").get().then(res => {
      this.setData({
        currentDate: res.data[0].date
      });

      const date = this.data.currentDate;
      //获取当日总数
      this._getTotalData(db, date);

      //获取当日新增数据
      this._getIncrementData(db, date)
    });
  },

  //获取总数信息
  _getTotalData(db, date) {
    db.collection("Total").where({
      date: date
    }).get().then(res => {
      this.setData({
        total: res.data
      });

      //绘制饼图
      this._drawPiechart();
      this._getTotalDetail();


    });
  },

  _getTotalDetail() {

    var index = 0;
    var scale = this.data.currentScale;

    switch (scale) {
      case "national":
        index = 0;
        break;
      case "province":
        index = 1;
        break;
      case "city":
        index = 2;
        break;
    };

    this.setData({
      totalDetail: [this.data.total[index].mild,
        this.data.total[index].severe,
        this.data.total[index].death,
        this.data.total[index].cure
      ],
      totalNum: this.data.total[index].total
    })
  },

  _getIncrementData(db, date) {
    db.collection("Increment").where({
      date: date
    }).get().then(res => {
      this.setData({
        increment: res.data
      })

      //绘制柱状图
      this._drawBarChart();
    });
  },

  _choseIndex() {
    var index = 0;
    var scale = this.data.currentScale;

    switch (scale) {
      case "national":
        index = 0;
        break;
      case "province":
        index = 1;
        break;
      case "city":
        index = 2;
        break;
    };

    return index;
  },

  //根据不同scale绘制饼图
  _drawPiechart() {

    var index = this._choseIndex();

    new wxCharts({
      canvasId: 'chartTotal',
      type: 'pie',
      series: [{
        name: '轻症',
        data: this.data.total[index].mild,
      }, {
        name: '重症',
        data: this.data.total[index].severe,
      }, {
        name: '死亡',
        data: this.data.total[index].death,
      }, {
        name: '治愈',
        data: this.data.total[index].cure,
      }],
      width: 360,
      height: 300,
      dataLabel: true,
    });
  },

  //绘制increment柱状图
  _drawBarChart() {

    var index = this._choseIndex();
    var type = this.data.currentType;
    var incredata = [];
    var lables = [];
    var numbers = [];

    switch (type) {
      case "confirmed":
        incredata = this.data.increment[index].confirmed;
        break;
      case "cure":
        incredata = this.data.increment[index].cure;
        break;
      case "death":
        incredata = this.data.increment[index].death;
        break;
    }




    if (this._isEmpty(incredata)) {
      this.setData({
        isEmpty: true
      });
      console.log("incredata empty!");
    } else {

      this.setData({
        isEmpty: false
      });

      //根据Number排序
      incredata.sort(function(a, b) {
        return b.number - a.number
      });

      incredata.forEach(function(value, index) {
        lables.push(value.label);
        numbers.push(value.number);
      })

      console.log(lables);
      console.log(numbers);

      new wxCharts({
        canvasId: 'chartIncrement',
        type: 'column',
        categories: lables,
        series: [{
          name: '',
          data: numbers
        }],
        yAxis: {
          format: function(val) {
            return val + '';
          }
        },
        width: 320,
        height: 300,
        legend: false,
      });
    }
  },


  // -----------监听事件函数------------------

  //监听Scale的改变
  handleScaleRadioClick(event) {
    const index = event.detail.index;

    this.setData({
      currentScale: scales[index]
    });
    // console.log(this.data.currentScale);
    this._drawPiechart();
    this._drawBarChart();
    this._getTotalDetail();
  },

  //监听type的改变
  handleTypeRadioClick(event) {
    const index = event.detail.index;
    this.setData({
      currentType: types[index]
    });

    this._drawBarChart();
  },

  //------------helper function--------
  _isEmpty(v) {
    switch (typeof v) {
      case 'undefined':
        return true;
      case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
        break;
      case 'boolean':
        if (!v) return true;
        break;
      case 'number':
        if (0 === v || isNaN(v)) return true;
        break;
      case 'object':
        if (null === v || v.length === 0) return true;
        for (var i in v) {
          return false;
        }
        return true;
    }
    return false;
  }
})