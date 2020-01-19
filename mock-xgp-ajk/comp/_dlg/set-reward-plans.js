// comp/_dlg/set-reward-plans.js
const util = require('../../utils/util.js');
const toastUtil = require('../../utils/toast-util.js');
const datasrc = require('../../utils/' + util.datasrc).datasrc;

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
    agentId: null,
    currentSelIndex: 0,
    rewardPlans: [],
    rewardPlanInfos: [],
    selectedRewardPlan: {}
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (rewardPlanData) {
      console.log('rewardPlanData: ', rewardPlanData);
      const { agentId, rewardPlans, selectedPlan } = rewardPlanData;
      const rewardPlanInfos = rewardPlans.map(pp => pp.info);
      let currentSelIndex = -1;
      rewardPlans.forEach((rp, idx) => {
        if (rp.id === selectedPlan)
          currentSelIndex = idx;
      });
      console.log('currentSelIndex: ', currentSelIndex);
      const selectedRewardPlan = currentSelIndex > 0 ? rewardPlans[currentSelIndex] : rewardPlans[0];
      this.setData({
        agentId,
        currentSelIndex,
        rewardPlans,
        rewardPlanInfos,
        selectedRewardPlan
      });
    },

    getSelectedRewardPlan: function() {
      return this.data.selectedRewardPlan;
    },

    onRewardPlanChange: function (e) {
      const { picker, value, index } = e.detail;
      let selectedRewardPlan = this.data.rewardPlans[index];
      console.log("reward plan changed: ", selectedRewardPlan);
      this.setData({ selectedRewardPlan });
    },

    onSetRewardPlan: function(e) {
      const that = this;
      const {agentId, selectedRewardPlan } = this.data;
      console.log("agentId, selectedRewardPlan", agentId, selectedRewardPlan);
      toastUtil.waiting4dlg(this, true, '提交数据中...');
      datasrc.proforg.updateRewardPlansReq(
        agentId,
        selectedRewardPlan.id,
        res => {
          toastUtil.waiting(that, false);
          toastUtil.success4dlg(that, "设置成功");
        }
      );
    }
  }
})
