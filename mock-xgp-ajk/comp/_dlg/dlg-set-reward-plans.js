// comp/_dlg/dlg-set-reward-plans.js
import Dialog from '../../vant-lib/dialog/dialog';

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

  },

  /**
   * Component methods
   */
  methods: {
    initData: function (rewardPlanData) {
      const setRewardPlans = this.selectComponent('#setRewardPlans');
      setRewardPlans.initData(rewardPlanData);
    },
    getSelectedRewardPlan: function() {
      const setRewardPlans = this.selectComponent('#setRewardPlans');
      return setRewardPlans.getSelectedRewardPlan();
    },
    showDlg: function() {
      let that = this;
      Dialog.alert({
        title: '设置积分套餐',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '关闭',
        context: this
      }).then(() => {
        console.log('triggering confirm event: ');
        that.triggerEvent("confirm", that.getSelectedRewardPlan());
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})
