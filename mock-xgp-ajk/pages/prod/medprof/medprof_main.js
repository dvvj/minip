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
    existingCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'newcustomer02',
      userName: 'x某',
      idCardNo: '310112197003113333',
      mobile: '137000333333',
      profile: {
        healthTags: 'healthTags - existingCustomer',
        medicineTags: 'medicineTags - existingCustomer'
      },
      products: [
        { id: 1, name: 'Astaxin虾青素', enabled: true, checked: false },
        { id: 2, name: 'ACO复合维生素', enabled: true, checked: false },
        { id: 3, name: '辅酶Q10', enabled: false, checked: true }
      ]
    },


    newCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'newcustomer02',
      password: '123',
      password2: '123',
      userName: 'x某',
      idCardNo: '310112197003113333',
      mobile: '137000333333',
      postAddr: '某省某市某区某路xx号 邮编111111',
      profile: {
        healthTags: 'healthTags - newCustomer',
        medicineTags: 'medicineTags - newCustomer'
      },
      products: [
        { id: 1, name: 'Astaxin虾青素', enabled: true, checked: false },
        { id: 2, name: 'ACO复合维生素', enabled: true, checked: false },
        { id: 3, name: '辅酶Q10', enabled: false, checked: true }
      ]
    },

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
    wx.showToast({
      title: `切换到标签 ${tabIndex}`,
      icon: 'none'
    });
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
    settingPassword.initData({
      disabled: false,
      loadingText: '',
      userid: 'medprof002',
      password: '123',
      password2: '123',
    })
  },

  updateExistingCustomerProfile: function () {
    let existingCustomerProfile = this.selectComponent("#existingCustomerProfile");
    console.log(existingCustomerProfile);
    let existingCustomer = this.data.existingCustomer;
    existingCustomerProfile.initData({
      existingCustomer,
      profile: existingCustomer.profile
    }, existingCustomer.products, true);
  },

  updateNewCustomerProfile: function() {
    let newCustomerProfile = this.selectComponent("#newCustomerProfile");
    console.log(newCustomerProfile);
    let newCustomer = this.data.newCustomer
    newCustomerProfile.initData({
      newCustomer,
      profile: this.data.newCustomer.profile
    }, this.data.newCustomer.products, true);
  },

  updateProfitStats: function () {
    let that = this;
    let startYearMonth = `${this.data.startEnd4ProfitStats.startYear}-${this.data.startEnd4ProfitStats.startMonth}`;
    let endYearMonth = `${this.data.startEnd4ProfitStats.endYear}-${this.data.startEnd4ProfitStats.endMonth}`;
    datasrc.medprof.getProfitStatsChartData(
      startYearMonth, endYearMonth,
      chartData => {
        startYearMonth, endYearMonth,
        new wxCharts({
          canvasId: 'columnCanvas',
          type: 'column',
          categories: chartData.yearMonths,
          series: [{
            name: '销售额',
            data: util.roundPriceArr(chartData.sales)
          }, {
            name: '佣金',
            data: util.roundPriceArr(chartData.rewards)
          }],
          yAxis: {
            format: function (val) {
              return val + '元';
            }
          },
          width: 360,
          height: 360
        });
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