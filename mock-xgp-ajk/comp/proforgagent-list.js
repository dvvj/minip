// comp/proforgagent-list.js
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
    proforgagents: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (proforgagents) {
      this.setData({ proforgagents });
    },
    onAddNewProfOrgAgentClicked: function() {
      console.log('onAddNewProfOrgAgentClicked, triggering event gotoAddNewProfOrgAgent');
      this.triggerEvent('gotoAddNewProfOrgAgent');
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


    onProfOrgAgentDetail: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currAgent = this.data.proforgagents[idx];
      console.log('proforgagents', currAgent);
      wx.setStorageSync(util.currAgentKey, currAgent)

      let that = this;
      this.setYearMonthDefault();

      toastUtil.waiting(this, true, '加载数据中...');
      datasrc.proforg.getProfitStatsChartDataPerProfOrgAgent(
        currAgent.agentId,
        this.data.yearMonthStart, this.data.yearMonthEnd,
        chartDataRaw => {
          console.log('getProfitStatsChartDataPerProfOrgAgent:', chartDataRaw);

          cacheUtil.saveProfitStatsPerProfOrgAgent(chartDataRaw);
          toastUtil.waiting(that, false);
          wx.navigateTo({
            url: "../../prod/proforg/agent-detail",
          })
        }
      );
    }
  }
})
