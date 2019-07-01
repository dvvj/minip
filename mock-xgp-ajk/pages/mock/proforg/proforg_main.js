// pages/mock/proforg/proforg_main.js
import Dialog from '../../../vant-lib/dialog/dialog';
const orderStatsTestData = require('../../../utils/org-order-stats-td.js')
const wxCharts = require('../../../utils/wxcharts-min.js');
const util = require('../../../utils/util.js')

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,

    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
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

  onDlgConfirm: function (e) {
    console.log('dlg confirm: ', this.yearMonth.getSelection())
  },
  onSetYearMonth: function (e) {
    Dialog.alert({
      title: '设置起止年月',
      showConfirmButton: true,
      showCancelButton: true
    }).then(() => {
      // on close
    }).catch(reason => console.log('cancelled: ', reason));
  },

  updateActiveTab: function (tabIndex) {
    this.setData({ activeTabIndex: tabIndex })
  },
  onTabbarChange: function (e) {
    console.log(e)
    wx.showToast({
      title: `切换到标签 ${e.detail}`,
      icon: 'none'
    });
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
    this.yearMonth = this.selectComponent("#yearMonthRange");
    this.setYearMonthDefault();
    this.yearMonth.setEnd(this.data.yearMonthEnd);
    this.yearMonth.setStart(this.data.yearMonthStart);
    
    let rawData = {
      "yearMonths": [
        "2019-01",
        "2019-02",
        "2019-03",
        "2019-04"
      ],
      "sales": [
        9049.939999999999,
        9049.939999999999,
        9349.919999999998,
        0
      ],
      "rewards": [
        2714.982,
        2714.982,
        2804.9759999999997,
        0
      ]
    }

    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: rawData.yearMonths,
      series: [{
        name: '销售额',
        data: util.roundPriceArr(rawData.sales)
      }, {
        name: '佣金',
        data: util.roundPriceArr(rawData.rewards)
      }],
      yAxis: {
        format: function (val) {
          return val + '元';
        }
      },
      width: 360,
      height: 360
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