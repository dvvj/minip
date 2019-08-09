// comp/medprof-list.js
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
    medprofs: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (medprofs) {
      this.setData({ medprofs });
    },

    onAddNewMedProfClicked: function(e) {
      console.log('onAddNewMedProfClicked, triggering event gotoAddNewMedProf');
      this.triggerEvent('gotoAddNewMedProf');
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

    onMedProfDetail: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currMedProf = this.data.medprofs[idx];
      console.log('medprofs', currMedProf);
      wx.setStorageSync(util.currMedProfKey, currMedProf)

      let that = this;
      this.setYearMonthDefault();

      toastUtil.waiting(this, true, '加载数据中...');
      datasrc.proforgagent.getProfitStatsChartDataPerMedProf(
        currMedProf.profId,
        this.data.yearMonthStart, this.data.yearMonthEnd,
        chartDataRaw => {
          console.log('getProfitStatsChartDataPerMedProf:', chartDataRaw);

          cacheUtil.saveProfitStatsPerMedProf(chartDataRaw);
          toastUtil.waiting(that, false);
          wx.navigateTo({
            url: "../../prod/orgagent/medprof-detail",
          })
        }
      );

    }
  }
})
