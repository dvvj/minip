// pages/mock/medprof/medprof_main.js
const util = require('../../../utils/util.js');
const cacheUtil = require('../../../utils/cache-util.js');
const toastUtil = require('../../../utils/toast-util.js');
const echartData = require('../../../utils/echart-data.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;
const registerUtil = require('../../../utils/register-util.js');

const tabIndices = {
  reffedCustomerInfos: 0,
  profitStats: 1,
  newCustomerProfile: 2,
  addByQRCode: 3,
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

    customerInfos: [],

    ec: {
      onInit: initChart
    },
    hideChart: false,
    showMoneyChecked: false,
    hasMultipleRoles: false
  },

  onShowMoneyChange(event) {
    let showMoneyChecked = event.detail;
    this.setData({ showMoneyChecked });
    //chart.clear();
    echartData.showStatsChart(chart, showMoneyChecked, this.data.chartDataRaw);
  },

  onClickIcon_InputUserId_Existing: function(e) {
    Toast('请输入用户唯一标识ID');
  },

  onGotoAddNewCustomer: function() {
    this.updateActiveTab(tabIndices.newCustomerProfile);
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
    toastUtil.waiting(this, true, '加载数据中...');
    let customerInfos = datasrc.medprof.getReffedCustomerInfos(
      customerInfos => {
        let reffedCustomerInfos = that.selectComponent("#reffedCustomerInfos");
        reffedCustomerInfos.initData(customerInfos);
        toastUtil.waiting(that, false);
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

    else if (tabIndex == tabIndices.addByQRCode) {
      this.updateAddByQRCode();
    }
    else if (tabIndex == tabIndices.setting) {
      this.updateSetting();
    }
  },

  updateAddByQRCode: function() {
    let that = this;
    let qrcodeList = this.selectComponent("#qrcodeList");
    //console.log(newCustomerProfile);
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.medprof.getQRCodeList(
      qrcodes => {
        console.log(qrcodes);
        qrcodeList.initData(registerUtil.userTypes.Customer, qrcodes);
        toastUtil.waiting(that, false);
      }
    )
  },

  updateQrcodeListAfterAdding: function() {
    let qrcodeList = this.selectComponent("#qrcodeList");
    let newlyAdded = cacheUtil.retrieveStorage(util.newlyAddedQrcodesKey, true);
    if (newlyAdded) {
      console.log('updateQrcodeListAfterAdding:', newlyAdded)
      //let newQrcodes = qrcodeList.convertAndDraw(newlyAdded);
      let mergedQrcodes = qrcodeList.getEncodedQrcodes().concat(newlyAdded);
      qrcodeList.initData(registerUtil.userTypes.Customer, mergedQrcodes);
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
    let that = this;
    let existingCustomerProfile = this.selectComponent("#existingCustomerProfile");
    console.log(existingCustomerProfile);
    toastUtil.waiting(this, true, '加载数据中...');
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
        toastUtil.waiting(that, false);
      }
    );
  },

  updateNewCustomerProfile: function() {
    let that = this;
    let newCustomerProfile = this.selectComponent("#newCustomerProfile");
    //console.log(newCustomerProfile);
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.medprof.getNewCustomerData(
      newCustomerData => {
        console.log(newCustomerData);
        let { newCustomer, profile, products, pricePlans } = newCustomerData;
        newCustomerProfile.initData(
          newCustomerData,
          true
        );
        toastUtil.waiting(that, false);
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
    let { _startYM, _endYM } = util.getYearMonthDefaultByProd();
    this.yearMonthRange(_startYM, _endYM);

    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    console.log('_startYM - _endYM', _startYM, _endYM);
    setYearMonthRange.setStart(`${_startYM.year}-${_startYM.month}`);
    setYearMonthRange.setEnd(`${_endYM.year}-${_endYM.month}`);
  },

  updateProfitStats: function () {
    let that = this;
  
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.medprof.getProfitStatsChartData(
      this.data.yearMonthStart, this.data.yearMonthEnd,
      chartDataRaw => {
        //util.createChart(chartData);
        console.log('getProfitStatsChartData:', chartDataRaw);
        that.setData({ chartDataRaw });
        let showMoney = that.data.showMoneyChecked;
        echartData.showStatsChart(chart, showMoney, chartDataRaw);
        // chart.setOption(
        //   echartData.medprofOptionFrom(chartData)
        // );
        toastUtil.waiting(that, false);
      }
    );
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
    this.updateProfitStats();
    this.hideEChart(false);
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
    console.log('in onShow........');
    if (this.data.activeTabIndex == tabIndices.addByQRCode) {
      this.updateQrcodeListAfterAdding();
    }
    else if (this.data.activeTabIndex == tabIndices.reffedCustomerInfos) {
      this.updateReffedCustomer();
    }
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