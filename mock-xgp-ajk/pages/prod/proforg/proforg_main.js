// pages/mock/proforg/proforg_main.js
import Dialog from '../../../vant-lib/dialog/dialog';
const orderStatsTestData = require('../../../utils/org-order-stats-td.js')
const toastUtil = require('../../../utils/toast-util.js');
//const wxCharts = require('../../../utils/wxcharts-min.js');
const echartData = require('../../../utils/echart-data.js');
const util = require('../../../utils/util.js')
const datasrc = require('../../../utils/' + util.datasrc).datasrc;

const tabIndices = {
  proforgAgentList: 0,
  profitStats: 1,
  addProfOrgAgent: 2,
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

  var option = echartData.proforgEmptyOption;

  chart.setOption(option);
  return chart;
};

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,

    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },

    ec: {
      onInit: initChart
    }

  },

  setYearMonthDefault: function () {

    let { _startYM, _endYM } = util.getYearMonthDefault();
    let yearMonthStart = `${_startYM.year}-${_startYM.month}`;
    let yearMonthEnd = `${_endYM.year}-${_endYM.month}`;
    console.log('yearMonthStart:', yearMonthStart);
    this.setData({
      profitStatsStart: _startYM,
      profitStatsEnd: _endYM,
      yearMonthStart,
      yearMonthEnd
    });
  },

  onGotoAddProfOrgAgent: function () {
    this.updateActiveTab(tabIndices.addProfOrgAgent);
  },

  updateTabContent: function(tabIndex) {
    if (tabIndex == tabIndices.proforgAgentList) {
      this.updateProfOrgAgentList();
    }
    else if (tabIndex == tabIndices.profitStats) {
      console.log('updateProfitStats');
      this.updateProfitStats();
    }
    else if (tabIndex == tabIndices.addProfOrgAgent) {
      console.log('updateAddProfOrgAgent');
      this.updateAddProfOrgAgent();
    }
    else if (tabIndex == tabIndices.setting) {
      this.updateSetting();
    }
  },

  updateSetting: function() {
    const settingPassword = this.selectComponent("#settingPassword");
    let userId = util.getUserId(); // wx.getStorageSync(util.userIdKey);
    settingPassword.initData({
      disabled: false,
      loadingText: '',
      userid: userId,
      password: '123',
      password2: '123',
    })
  },

  updateAddProfOrgAgent: function() {
    let that = this;
    let newProfOrgAgent = this.selectComponent("#newProfOrgAgent");
    console.log(newProfOrgAgent);
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.proforg.getNewProfOrgAgentData(
      newAgentData => {
        console.log(newAgentData);
        newProfOrgAgent.initData(
          newAgentData
        );
        toastUtil.waiting(that, false);
      }
    )
  },

  updateProfOrgAgentList: function() {
    let that = this;
    console.log('in updateProfOrgAgentList');
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.proforg.getProfOrgAgentList(
      agents => {
        console.log('in updateMedProfs, ', agents);
        let proforgagentList = that.selectComponent("#proforgagentList");
        proforgagentList.initData(agents);
        toastUtil.waiting(that, false);
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
  onConfirmYearMonthRange: function (e) {
    console.log('in onConfirmYearMonthRange', e);
    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    let range = setYearMonthRange.getSelection();
    console.log('range: ', range);
    this.yearMonthRange(range.start, range.end);
    this.updateProfitStats();
  },

  updateProfitStats: function() {
    let that = this;
    let yearMonthStart = this.data.yearMonthStart;
    let yearMonthEnd = this.data.yearMonthEnd;
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.proforg.getProfitStatsChartData(
      yearMonthStart, yearMonthEnd,
      chartData => {
        console.log('chartData:', chartData);
        let opt = echartData.proforgOptionFrom(chartData);
        console.log('opt:', opt);
        if (chart) {
          chart.setOption(opt);
        }
        else {
          console.log('todo: undefined chart')
        }
        toastUtil.waiting(that, false);
      }
    );

  },

  updateActiveTab: function (tabIndex) {
    this.setData({ activeTabIndex: tabIndex })
    this.updateTabContent(tabIndex);
  },
  onTabbarChange: function (e) {
    console.log(e)
    // wx.showToast({
    //   title: `切换到标签 ${e.detail}`,
    //   icon: 'none'
    // });
    this.updateActiveTab(e.detail)
  },
  onSwiperChange: function (e) {
    console.log(e.detail.current)
    this.updateActiveTab(e.detail.current)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setYearMonthRange = this.selectComponent("#setYearMonthRange");
    this.setYearMonthDefault();
    this.setYearMonthRange.setEnd(this.data.yearMonthEnd);
    this.setYearMonthRange.setStart(this.data.yearMonthStart);

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