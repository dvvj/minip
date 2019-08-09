// pages/prod/proforg/agent-detail.js
const util = require('../../../utils/util.js');
const cacheUtil = require('../../../utils/cache-util.js');
const echartData = require('../../../utils/echart-data.js');
const toastUtil = require('../../../utils/toast-util.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;

import * as echarts from '../../../ec-canvas/echarts';

var chart = null;
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  //var option = echartData.medprofEmptyOption;
  let chartData = cacheUtil.getProfitStatsPerProfOrgAgent();

  let option = echartData.proforgOptionFrom(chartData);
  console.log('option: ', option);

  chart.setOption(option);
  return chart;
};

Page({

  /**
   * Page initial data
   */
  data: {
    currAgent: {},
    ec: {
      onInit: initChart
    },
    hideChart: false
  },

  setYearMonthDefault: function () {
    let { _startYM, _endYM } = util.getYearMonthDefaultByProd();
    this.yearMonthRange(_startYM, _endYM);

    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    console.log('_startYM - _endYM', _startYM, _endYM);
    setYearMonthRange.setStart(`${_startYM.year}-${_startYM.month}`);
    setYearMonthRange.setEnd(`${_endYM.year}-${_endYM.month}`);
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
    let that = this;
    console.log('in onConfirmYearMonthRange', e);
    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    let range = setYearMonthRange.getSelection();
    console.log('range: ', range);
    this.yearMonthRange(range.start, range.end);

    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.proforg.getProfitStatsChartDataPerProfOrgAgent(
      this.data.currAgent.agentId,
      this.data.yearMonthStart, this.data.yearMonthEnd,
      chartDataRaw => {
        //util.createChart(chartData);
        // chart.setOption(
        //   echartData.medprofOptionFrom(chartData)
        // );
        console.log('getProfitStatsChartDataPerProfOrgAgent:', chartDataRaw);
        let option = echartData.proforgOptionFrom(chartDataRaw);

        chart.setOption(option);
        toastUtil.waiting(that, false);
      }
    );

    // this.updateProfitStats();
    this.hideEChart(false);
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let currAgent = wx.getStorageSync(util.currAgentKey);

    console.log('in agent-detail', currAgent);
    this.setData({ currAgent })
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