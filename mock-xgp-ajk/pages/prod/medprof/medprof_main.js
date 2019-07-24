// pages/mock/medprof/medprof_main.js
const util = require('../../../utils/util.js');
const echartData = require('../../../utils/echart-data.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;
const reffedCustomersUrl = util.webappBase + '/medprof/reffedCustomerInfos'
//const wxCharts = require('../../../utils/wxcharts-min.js');

const tabIndices = {
  reffedCustomerInfos: 0,
  profitStats: 1,
  newCustomerProfile: 2,
  existingCustomerProfile: 3,
  setting: 4
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
    // startEnd4ProfitStats: {
    //   startYear: 2019,
    //   startMonth: 2,
    //   endYear: 2019,
    //   endMonth: 7
    // },
    customerInfos: [],

    ec: {
      onInit: initChart
    }
  },


  onClickIcon_InputUserId_Existing: function(e) {
    Toast('请输入用户唯一标识ID');
  },

  updateActiveTab: function (tabIndex) {
    this.updateTabContent(tabIndex);
    this.setData({ activeTabIndex: tabIndex });
  },
  onTabbarChange: function (e) {
    console.log(e)
    let tabIndex = e.detail
    this.updateActiveTab(tabIndex)
  },
  onSwiperChange: function (e) {
    let tabIndex = e.detail.current
    console.log(tabIndex)
    this.updateActiveTab(tabIndex)
  },

  updateReffedCustomer: function() {
    let that = this;
    let customerInfos = datasrc.medprof.getReffedCustomerInfos(
      customerInfos => {
        let reffedCustomerInfos = that.selectComponent("#reffedCustomerInfos");
        reffedCustomerInfos.initData(customerInfos)
      }
    );
  },

  updateTabContent: function(tabIndex) {

    if (tabIndex == tabIndices.reffedCustomerInfos) {
      this.updateReffedCustomer();
    }
    else if (tabIndex == tabIndices.profitStats) {
      // todo: cache data
      this.updateProfitStats();
    }
    else if (tabIndex == tabIndices.newCustomerProfile) {
      this.updateNewCustomerProfile();
    }
    else if (tabIndex == tabIndices.existingCustomerProfile) {
      this.updateExistingCustomerProfile();
    }
    else if (tabIndex == tabIndices.setting) {
      this.updateSetting();
    }
  },

  updateSetting: function () {
    const settingPassword = this.selectComponent("#settingPassword");
    let userId = util.getUserId(); //wx.getStorageSync(util.userIdKey);
    settingPassword.initData({
      disabled: false,
      loadingText: '',
      userid: userId,
      password: '123',
      password2: '123',
    })
  },

  updateExistingCustomerProfile: function () {
    let existingCustomerProfile = this.selectComponent("#existingCustomerProfile");
    console.log(existingCustomerProfile);
    this.showWaitingToast(true, '加载数据中...');
    datasrc.medprof.getExistingCustomerData(
      existingCustomer => {
        existingCustomerProfile.initData(
          {
            existingCustomer,
            profile: existingCustomer.profile
          },
          existingCustomer.products,
          existingCustomer.pricePlans,
          true
        );
        this.showWaitingToast(false);
      }
    );
  },

  showWaitingToast: function(doShow, msg) {
    let waitingToast = this.selectComponent('#waitingToast');
    doShow ? waitingToast.show(msg) : waitingToast.clear();
  },

  updateNewCustomerProfile: function() {
    let newCustomerProfile = this.selectComponent("#newCustomerProfile");
    //console.log(newCustomerProfile);
    this.showWaitingToast(true, '加载数据中...');
    datasrc.medprof.getNewCustomerData(
      newCustomerData => {
        console.log(newCustomerData);
        let { newCustomer, profile, products, pricePlans } = newCustomerData;
        newCustomerProfile.initData(
          newCustomerData,
          true
        );
        this.showWaitingToast(false);
      }
    )

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

  updateProfitStats: function () {
    let that = this;
  
    this.showWaitingToast(true, '加载数据中...');
    datasrc.medprof.getProfitStatsChartData(
      this.data.yearMonthStart, this.data.yearMonthEnd,
      chartData => {
        //util.createChart(chartData);
        chart.setOption(
          echartData.medprofOptionFrom(chartData)
        );
        that.showWaitingToast(false);
        // new wxCharts({
        //   canvasId: 'columnCanvas',
        //   type: 'column',
        //   categories: chartData.yearMonths,
        //   series: [{
        //     name: '销售额',
        //     data: util.roundPriceArr(chartData.sales)
        //   }, {
        //     name: '佣金',
        //     data: util.roundPriceArr(chartData.rewards)
        //   }],
        //   yAxis: {
        //     format: function (val) {
        //       return '￥' + val;
        //     }
        //   },
        //   width: 360,
        //   height: 360
        // });
      }
    );
  },

  onConfirmYearMonthRange: function (e) {
    console.log('in onConfirmYearMonthRange', e);
    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    let range = setYearMonthRange.getSelection();
    console.log('range: ', range);
    this.yearMonthRange(range.start, range.end);
    this.updateProfitStats();
  },

  onLoad: function (options) {
    this.setYearMonthDefault();
    this.updateTabContent(this.data.activeTabIndex);
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