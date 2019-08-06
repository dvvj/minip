// comp/reffed-customer-infos.js
const util = require('../utils/util.js');

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
      this.setData({ customerInfos });
    },

    onAddNewCustomerClicked: function(e) {
      console.log('onAddNewCustomerClicked, triggering event gotoAddNewCustomer');
      this.triggerEvent('gotoAddNewCustomer');
    },

    onClick: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currCustomer = this.data.customerInfos[idx];
      console.log('currCustomer', currCustomer);
      wx.setStorageSync(util.currCustomerKey, currCustomer)
      let that = this;

      let chartData = {
        "yearMonths": [
          "2019-01",
          "2019-02",
          "2019-03",
          "2019-04"
        ],
        // "sales": [
        //   0,
        //   0,
        //   0,
        //   0
        // ],
        // "rewards": [
        //   0,
        //   0,
        //   0,
        //   0
        // ]
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
      };
      wx.setStorageSync(util.profitStatsByCustomerChartDataKey, chartData)

      // toastUtil.waiting(this, true, '加载数据中...');
      // datasrc.medprof.getProfitStatsChartData(
      //   this.data.yearMonthStart, this.data.yearMonthEnd,
      //   chartData => {
      //     //util.createChart(chartData);
      //     // chart.setOption(
      //     //   echartData.medprofOptionFrom(chartData)
      //     // );
      //     toastUtil.waiting(that, false);
      //   }
      // );

    }
  }
})
