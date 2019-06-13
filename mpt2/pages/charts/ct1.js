// pages/charts/ct1.js
let wxCharts = require('../../utils/wxcharts-min.js');

Page({

  /**
   * Page initial data
   */
  data: {
    medprofData: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: 'cat1',
        data: 50,
      }, {
        name: 'cat2',
        data: 30,
      }, {
        name: 'cat3',
        data: 1,
      }, {
        name: 'cat4',
        data: 1,
      }, {
        name: 'cat5',
        data: 46,
      }],
      width: 360,
      height: 300,
      dataLabel: true
    });

    let rawData = {
      "yearMonths": [
        "2018-11",
        "2018-12",
        "2019-01",
        "2019-02",
        "2019-03",
        "2019-04"
      ],
      "sales": [
        299.99,
        299.99,
        0,
        0,
        0,
        0
      ],
      "rewards": [
        29.999000000000002,
        29.999000000000002,
        0,
        0,
        0,
        0
      ]
    }
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: rawData.yearMonths, //['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: 'sales',
        data: rawData.sales
      }, {
        name: 'rewards',
        data: rawData.rewards
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        }
      },
      width: 320,
      height: 200
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})