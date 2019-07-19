// pages/mock/medprof/medprof_main.js
const util = require('../../../utils/util.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;
const reffedCustomersUrl = util.webappBase + '/medprof/reffedCustomerInfos'
const wxCharts = require('../../../utils/wxcharts-min.js');

const tabIndices = {
  reffedCustomerInfos: 0,
  profitStats: 1,
  newCustomerProfile: 2,
  existingCustomerProfile: 3,
  setting: 4
};

import * as echarts from '../../../ec-canvas/echarts';

let opt2 = {
  color: ['#32c5e9', '#67e0e3'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    },
    confine: true
  },
  legend: {
    data: ['正面', '热度']
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 15,
    top: 40,
    containLabel: true
  },
  xAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }
  ],
  series: [
    {
      name: '正面',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true
        }
      },
      data: [120, 102, 141, 174, 190, 250, 220],
      itemStyle: {
        // emphasis: {
        //   color: '#32c5e9'
        // }
      }
    },
    {
      name: '热度',
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'inside'
        }
      },
      data: [300, 270, 340, 344, 300, 320, 310],
      itemStyle: {
        // emphasis: {
        //   color: '#37a2da'
        // }
      }
    }

  ]
};
var chart = null;
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = opt2;

  chart.setOption(option);
  return chart;
};

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,
    startEnd4ProfitStats: {
      startYear: 2019,
      startMonth: 2,
      endYear: 2019,
      endMonth: 7
    },
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
    // wx.showToast({
    //   title: `切换到标签 ${tabIndex}`,
    //   icon: 'none'
    // });
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
    let userId = wx.getStorageSync(util.userIdKey);
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
    console.log(newCustomerProfile);
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

  updateProfitStats: function () {
    let that = this;
    let startYearMonth = `${this.data.startEnd4ProfitStats.startYear}-${this.data.startEnd4ProfitStats.startMonth}`;
    let endYearMonth = `${this.data.startEnd4ProfitStats.endYear}-${this.data.startEnd4ProfitStats.endMonth}`;
    this.showWaitingToast(true, '加载数据中...');
    datasrc.medprof.getProfitStatsChartData(
      startYearMonth, endYearMonth,
      chartData => {
        util.createChart(chartData);
        this.showWaitingToast(false);
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

  onLoad: function (options) {
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