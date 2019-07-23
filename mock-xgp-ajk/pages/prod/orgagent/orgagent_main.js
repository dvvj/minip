// pages/prod/orgagent/orgagent_main.js
const util = require('../../../utils/util.js');
const echartData = require('../../../utils/echart-data.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;

const tabIndices = {
  medprofInfos: 0,
  profitStats: 1,
  newMedProf: 2,
  setting: 3
};

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
    activeTabIndex: 0,
    ec: {
      onInit: initChart
    }
  },
  onTabbarChange: function (e) {
    console.log(e)
    let tabIndex = e.detail
    this.updateActiveTab(tabIndex)
  },
  updateActiveTab: function (tabIndex) {
    this.updateTabContent(tabIndex);
    this.setData({ activeTabIndex: tabIndex });
  },
  onSwiperChange: function (e) {
    let tabIndex = e.detail.current
    console.log(tabIndex)
    this.updateActiveTab(tabIndex)
  },
  updateTabContent: function (tabIndex) {

    if (tabIndex == tabIndices.medprofInfos) {
      this.updateMedProfs();
    }
    else if (tabIndex == tabIndices.profitStats) {
      // todo: cache data
      this.updateProfitStats();
    }
    else if (tabIndex == tabIndices.newMedProf) {
      this.updateNewMedProf();
    }
    else if (tabIndex == tabIndices.setting) {
      this.updateSetting();
    }
  },

  updateMedProfs: function () {
    let that = this;
    console.log('in updateMedProfs');
    datasrc.proforgagent.getMedProfs(
      medprofs => {
        console.log('in updateMedProfs, ', medprofs);
        let medprofList = that.selectComponent("#medprofList");
        medprofList.initData(medprofs)
      }
    );
  },

  yearMonthRange: function (startYM, endYM) {
    let yearMonthStart = `${startYM.year}-${startYM.month}`;
    let yearMonthEnd = `${endYM.year}-${endYM.month}`;

    this.setData({
      yearMonthStart,
      yearMonthEnd
    });
  },

  setYearMonthDefault: function () {
    let { _startYM, _endYM } = util.getYearMonthDefault();
    this.yearMonthRange(_startYM, _endYM);
  },

  showWaitingToast: function (doShow, msg) {
    let waitingToast = this.selectComponent('#waitingToast');
    doShow ? waitingToast.show(msg) : waitingToast.clear();
  },

  updateProfitStats: function () {
    let that = this;

    this.showWaitingToast(true, '加载数据中...');
    datasrc.proforgagent.getProfitStatsChartData(
      this.data.yearMonthStart, this.data.yearMonthEnd,
      chartData => {
        //util.createChart(chartData);
        chart.setOption(
          echartData.medprofOptionFrom(chartData)
        );
        that.showWaitingToast(false);
      }
    );
  },
  showWaitingToast: function (doShow, msg) {
    let waitingToast = this.selectComponent('#waitingToast');
    doShow ? waitingToast.show(msg) : waitingToast.clear();
  },
  updateNewMedProf: function () {
    let newMedProf = this.selectComponent("#newMedProf");
    console.log(newMedProf);
    this.showWaitingToast(true, '加载数据中...');
    datasrc.proforgagent.getNewMedProfData(
      newMedProfData => {
        console.log(newMedProfData);
        newMedProf.initData(
          newMedProfData
        );
        this.showWaitingToast(false);
      }
    )

  },

  onConfirmYearMonthRange: function (e) {
    console.log('in onConfirmYearMonthRange', e);
    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    let range = setYearMonthRange.getSelection();
    console.log('range: ', range);
    this.yearMonthRange(range.start, range.end);
    this.updateProfitStats();
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setYearMonthDefault();
    this.updateActiveTab(this.data.activeTabIndex);
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