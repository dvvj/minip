// pages/prod/medprof/customer-detail.js
const util = require('../../../utils/util.js');
const echartData = require('../../../utils/echart-data.js');

import * as echarts from '../../../ec-canvas/echarts';

var chart = null;
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = echartData.medprofEmptyOption;

  chart.setOption(option);
  return chart;
};

Page({

  /**
   * Page initial data
   */
  data: {
    ec: {
      onInit: initChart
    },
    hideChart: false
  },

  setYearMonthDefault: function () {
    let { _startYM, _endYM } = util.getYearMonthDefault();
    this.yearMonthRange(_startYM, _endYM);
  },

  yearMonthRange: function (startYM, endYM) {
    let yearMonthStart = `${startYM.year}-${startYM.month}`;
    let yearMonthEnd = `${endYM.year}-${endYM.month}`;

    this.setData({
      yearMonthStart,
      yearMonthEnd
    });
  },

  hideEChart: function (hide) {
    this.setData({ hideChart: hide });
  },
  onPreSetYearMonthRange: function (e) {
    this.hideEChart(true);
  },
  onConfirmYearMonthRange: function (e) {
    console.log('in onConfirmYearMonthRange', e);
    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    let range = setYearMonthRange.getSelection();
    console.log('range: ', range);
    this.yearMonthRange(range.start, range.end);
    // this.updateProfitStats();
    this.hideEChart(false);
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let currCustomer = wx.getStorageSync(util.currCustomerKey);

    console.log('in customer-detail', currCustomer);
    this.setData({ currCustomer });
    this.setYearMonthDefault();

    let chartData = wx.getStorageSync(util.profitStatsByCustomerChartDataKey);

    setTimeout(function() {
      chart.setOption(
        echartData.medprofOptionFrom(chartData)
      );
    }, 100);
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