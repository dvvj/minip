// comp/reffed-customer-infos.js
const util = require('../utils/util.js');
const cacheUtil = require('../utils/cache-util.js');
const toastUtil = require('../utils/toast-util.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    customerInfos: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(customerInfos) {
      let customerInfoFixed = customerInfos.map(item => {
        if (!item.customerName)
          item.customerName = "_为空_";
      })
      this.setData({ customerInfos });
    },

    onAddNewCustomerClicked: function(e) {
      console.log('onAddNewCustomerClicked, triggering event gotoAddNewCustomer');
      this.triggerEvent('gotoAddNewCustomer');
    },

    setYearMonthDefault: function () {
      let { _startYM, _endYM } = util.getYearMonthDefaultByProd();
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

    saveCurrCustomer: function(customerIdx) {
      let currCustomer = this.data.customerInfos[customerIdx];
      console.log('currCustomer', currCustomer);
      wx.setStorageSync(util.currCustomerKey, currCustomer);
      return currCustomer;
    },

    onCustomerDetail: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currCustomer = this.saveCurrCustomer(idx);
      // let currCustomer = this.data.customerInfos[idx];
      // console.log('currCustomer', currCustomer);
      // wx.setStorageSync(util.currCustomerKey, currCustomer)
      let that = this;
      this.setYearMonthDefault();

      toastUtil.waiting(this, true, '加载数据中...');
      let { userType } = util.getStoredTokens();
      var datasrcFunc = null;
      if (userType == 'MedProf') {
        datasrcFunc = datasrc.medprof.getProfitStatsChartDataPerCustomer;
      } else if (userType == 'ProfOrgAgent') {
        datasrcFunc = datasrc.proforgagent.getProfitStatsChartDataPerCustomer;
      }
      else {
        console.log('invalid user type: ', userType);
      }
      datasrcFunc(
        currCustomer.customerId,
        this.data.yearMonthStart, this.data.yearMonthEnd,
        chartDataRaw => {
          //util.createChart(chartData);
          // chart.setOption(
          //   echartData.medprofOptionFrom(chartData)
          // );
          console.log('getProfitStatsChartDataPerCustomer:', chartDataRaw);

          cacheUtil.saveProfitStatsPerCustomer(chartDataRaw);
          toastUtil.waiting(that, false);
          wx.navigateTo({
            url: "../../prod/medprof/customer-detail",
          })
        }
      );

    },

    onUpdateCustomerProfile: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currCustomer = this.saveCurrCustomer(idx);

      let that = this;
      toastUtil.waiting(this, true, '加载数据中...');
      datasrc.medprof.getUpdateCustomerProfilePreReqData(
        currCustomer.customerId,
        customerProfile => {
          //util.createChart(chartData);
          // chart.setOption(
          //   echartData.medprofOptionFrom(chartData)
          // );
          console.log('getCustomerProfile:', customerProfile);

          cacheUtil.saveCurrCustomerProfile(customerProfile);
          toastUtil.waiting(that, false);
          wx.navigateTo({
            url: "../../prod/medprof/update-customer-profile",
          })
        }
      );
    }
  }
})
