// pages/prod/orgagent/orgagent_main.js
const util = require('../../../utils/util.js');
const toastUtil = require('../../../utils/toast-util.js');
const echartData = require('../../../utils/echart-data.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;
const cacheUtil = require('../../../utils/cache-util.js');
const registerUtil = require('../../../utils/register-util.js');

const tabIndices = {
  medprofInfos: 0,
  reffedCustomerInfos: 1,
  profitStats: 2,
  //newMedProf: 3,
  addMedProfByQRCode: 3,
  addCustomerByQRCode: 4,
  setting: 5
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
    },
    hideChart: false,
    showMoneyChecked: false
  },

  onGotoAddNewCustomer: function () {
    console.log('todo: show msg to use qr code');
  },

  onShowMoneyChange(event) {
    let showMoneyChecked = event.detail;
    this.setData({ showMoneyChecked });
    //chart.clear();
    echartData.showStatsChart(chart, showMoneyChecked, this.data.chartDataRaw);
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
    else if (tabIndex == tabIndices.reffedCustomerInfos) {
      // todo: cache data
      this.updateReffedCustomer();
    }
    else if (tabIndex == tabIndices.profitStats) {
      // todo: cache data
      this.updateProfitStats();
    }
    // else if (tabIndex == tabIndices.newMedProf) {
    //   this.updateNewMedProf();
    // }
    else if (tabIndex == tabIndices.addMedProfByQRCode) {
      this.updateAddMedProfByQRCode();
    }
    else if (tabIndex == tabIndices.addCustomerByQRCode) {
      this.updateAddCustomerByQRCode();
    }
    else if (tabIndex == tabIndices.setting) {
      this.updateSetting();
    }
  },
  updateAddByQRCode: function (userType, componentId, datasrcFunc) {
    let that = this;
    // let compid = userType === registerUtil.userTypes.userTypes.MedProf ?
    //   "#medprofQrcodeList" : "#medprofQrcodeList";
    let qrcodeList = this.selectComponent(componentId);
    //console.log(newCustomerProfile);
    toastUtil.waiting(this, true, '加载数据中...');
    datasrcFunc(
      qrcodes => {
        console.log(qrcodes);
        qrcodeList.initData(userType, qrcodes);
        toastUtil.waiting(that, false);
      }
    )
  },
  updateAddMedProfByQRCode: function () {
    this.updateAddByQRCode(
      registerUtil.userTypes.MedProf,
      "#medprofQrcodeList",
      datasrc.proforgagent.getMedProfQRCodeList
    );
  },
  updateAddCustomerByQRCode: function () {
    this.updateAddByQRCode(
      registerUtil.userTypes.Customer,
      "#customerQrcodeList",
      datasrc.proforgagent.getCustomerQRCodeList
    );
  },
  updateSetting: function () {
    const settingPassword = this.selectComponent("#settingPassword");
    let userId = util.getUserId(); //wx.getStorageSync(util.userIdKey);
    settingPassword.initData({
      disabled: false,
      loadingText: '',
      userid: userId,
      password: '',
      password2: '',
    })
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
  updateReffedCustomer: function () {
    let that = this;
    toastUtil.waiting(this, true, '加载数据中...');
    let customerInfos = datasrc.proforgagent.getReffedCustomerInfos(
      customerInfos => {
        let reffedCustomerInfos = that.selectComponent("#reffedCustomerInfos");
        reffedCustomerInfos.initData(customerInfos);
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
    datasrc.proforgagent.getProfitStatsChartData(
      this.data.yearMonthStart, this.data.yearMonthEnd,
      chartDataRaw => {
        console.log('getProfitStatsChartData:', chartDataRaw);
        that.setData({ chartDataRaw });
        let showMoney = that.data.showMoneyChecked;
        echartData.showStatsChart(chart, showMoney, chartDataRaw);

        toastUtil.waiting(that, false);
      }
    );
  },

  updateNewMedProf: function () {
    let that = this;
    let newMedProf = this.selectComponent("#newMedProf");
    console.log(newMedProf);
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.proforgagent.getNewMedProfData(
      newMedProfData => {
        console.log(newMedProfData);
        newMedProf.initData(
          newMedProfData
        );
        toastUtil.waiting(that, false);
      }
    )

  },

  onGotoAddNewMedProf: function() {
    this.updateActiveTab(tabIndices.newMedProf);
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
    console.log('in onShow........');
    if (this.data.activeTabIndex == tabIndices.addMedProfByQRCode) {
      this.updateMedProfQrcodeListAfterAdding();
    }
    if (this.data.activeTabIndex == tabIndices.addCustomerByQRCode) {
      this.updateCustomerQrcodeListAfterAdding();
    }
    else if (this.data.activeTabIndex == tabIndices.reffedCustomerInfos) {
      this.updateReffedCustomer();
    }
  },

  updateQrcodeListAfterAdding: function (userType, componentId) {
    let qrcodeList = this.selectComponent(componentId);
    let newlyAdded = cacheUtil.retrieveStorage(util.newlyAddedQrcodesKey, true);
    if (newlyAdded) {
      console.log('updateQrcodeListAfterAdding:', userType, newlyAdded)
      //let newQrcodes = qrcodeList.convertAndDraw(newlyAdded);
      let mergedQrcodes = qrcodeList.getEncodedQrcodes().concat(newlyAdded);
      qrcodeList.initData(userType, mergedQrcodes);
    }
  },
  updateMedProfQrcodeListAfterAdding: function () {
    this.updateQrcodeListAfterAdding(
      registerUtil.userTypes.MedProf, "#medprofQrcodeList"
    );
  },
  updateCustomerQrcodeListAfterAdding: function () {
    this.updateQrcodeListAfterAdding(
      registerUtil.userTypes.Customer, "#customerQrcodeList"
    );
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