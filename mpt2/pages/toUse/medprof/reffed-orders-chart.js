// pages/toUse/medprof/reffed-orders-chart.js

let wxCharts = require('../../../utils/wxcharts-min.js');

Page({

  /**
   * Page initial data
   */
  data: {
    reffedOrders: []
  },

  /**
   * Lifecycle function--Called when page load
   */

  onLoad: function (options) {
    let rawData = [
      {
        "id": 1100,
        "customerId": "c＿o1a1p1_customer1",
        "profId": "mp＿o1a1_prof1",
        "productId": 2,
        "qty": 2,
        "actualCost": 299.99,
        "creationTime": "2018-10-02T20:30:44+02:00",
        "payTime": "2018-10-02T20:50:44+02:00",
        "procTime1": null,
        "procTime2": null,
        "procTime3": null
      },
      {
        "id": 1101,
        "customerId": "c＿o1a1p1_customer1",
        "profId": "mp＿o1a1_prof1",
        "productId": 2,
        "qty": 2,
        "actualCost": 299.99,
        "creationTime": "2018-11-02T19:30:44+01:00",
        "payTime": "2018-11-02T19:50:44+01:00",
        "procTime1": null,
        "procTime2": null,
        "procTime3": null
      },
      {
        "id": 1102,
        "customerId": "c＿o1a1p1_customer1",
        "profId": "mp＿o1a1_prof1",
        "productId": 2,
        "qty": 2,
        "actualCost": 299.99,
        "creationTime": "2018-12-02T19:30:44+01:00",
        "payTime": "2018-12-02T19:50:44+01:00",
        "procTime1": null,
        "procTime2": null,
        "procTime3": null
      },
      {
        "id": 1300,
        "customerId": "c＿o1a1p1_customer2",
        "profId": "mp＿o1a1_prof1",
        "productId": 1,
        "qty": 1,
        "actualCost": 1499.99,
        "creationTime": "2017-01-02T17:30:44+01:00",
        "payTime": "2017-01-02T17:50:44+01:00",
        "procTime1": null,
        "procTime2": null,
        "procTime3": null
      },
      {
        "id": 1301,
        "customerId": "c＿o1a1p1_customer2",
        "profId": "mp＿o1a1_prof1",
        "productId": 1,
        "qty": 1,
        "actualCost": 1499.99,
        "creationTime": "2017-02-02T17:30:44+01:00",
        "payTime": "2017-02-02T17:50:44+01:00",
        "procTime1": null,
        "procTime2": null,
        "procTime3": null
      },
      {
        "id": 1400,
        "customerId": "c＿o1a1p1_customer4",
        "profId": "mp＿o1a1_prof1",
        "productId": 1,
        "qty": 1,
        "actualCost": 1499.99,
        "creationTime": "2017-01-02T17:30:44+01:00",
        "payTime": "2017-01-02T17:50:44+01:00",
        "procTime1": null,
        "procTime2": null,
        "procTime3": null
      },
      {
        "id": 1401,
        "customerId": "c＿o1a1p1_customer4",
        "profId": "mp＿o1a1_prof1",
        "productId": 1,
        "qty": 1,
        "actualCost": 1499.99,
        "creationTime": "2017-02-02T17:30:44+01:00",
        "payTime": "2017-02-02T17:50:44+01:00",
        "procTime1": null,
        "procTime2": null,
        "procTime3": null
      }
    ]

    this.setData({ reffedOrders: rawData })

    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
      series: [{
        name: '总金额',
        data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8, 1.7],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '佣金',
        data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94, 0.6],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '金额 (元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
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