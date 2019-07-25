// comp/new-proforgagent.js
const util = require('../utils/util.js');
const inputCheck = require('../utils/input-check.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;
import Toast from '../vant-lib/toast/toast';

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
    newProfOrgAgent: {},
    errorMsgs: {},
    rewardPlans: [],
    rewardPlanInfos: []
  },

  /**
   * Component methods
   */
  methods: {
    showWaitingToast: function (doShow, msg) {
      let waitingToast = this.selectComponent('#waitingToast');
      doShow ? waitingToast.show(msg) : waitingToast.clear();
    },
    initData: function (newProfOrgAgentData) {
      console.log('newProfOrgAgentData', newProfOrgAgentData);
      let { newProfOrgAgent, rewardPlans } = newProfOrgAgentData;
      let rewardPlanInfos = rewardPlans.map(p => p.info);
      let selectedRewardPlan = rewardPlans[0];
      this.setData({
        newProfOrgAgent, rewardPlans, rewardPlanInfos, selectedRewardPlan
      });
    },
    onRewardPlanChange: function (e) {
      const { picker, value, index } = e.detail;
      let selectedRewardPlan = this.data.rewardPlans[index];
      console.log("reward plan changed: ", selectedRewardPlan);
      this.setData({ selectedRewardPlan });
    },

    updateNewProfOrgAgent: function (field, e) {
      var t = this.data.newProfOrgAgent;
      t[field] = e.detail;
      this.setData({ newProfOrgAgent: t });
    },
    updateErrorMsg: function (field, msg) {
      let errorMsgs = this.data.errorMsgs;
      errorMsgs[field] = msg;
      console.log('errorMsgs', errorMsgs);
      this.setData({ errorMsgs });
    },
    checkAndUpdateInput: function (field, checker, e) {
      let input = e.detail;
      this.updateNewProfOrgAgent(field, e)
      let err = checker.check(input);
      this.updateErrorMsg(field, err);
    },
    onInputUserId: function (e) {
      this.checkAndUpdateInput(
        "agentid",
        inputCheck.agentid,
        e
      );
    },
    onInputPassword: function (e) {
      this.checkAndUpdateInput(
        "password",
        inputCheck.password,
        e
      );
    },
    onInputPassword2: function (e) {
      this.updateNewProfOrgAgent("password2", e)
    },
    onInputUserName: function (e) {
      this.checkAndUpdateInput(
        "name",
        inputCheck.name,
        e
      );
    },
    onInputIdCardNo: function (e) {
      this.checkAndUpdateInput(
        "idCardNo",
        inputCheck.idCardNo,
        e
      );
    },
    onInputMobile: function (e) {
      this.checkAndUpdateInput(
        "mobile",
        inputCheck.mobile,
        e
      );
    },
    onInputInfo: function (e) {
      this.checkAndUpdateInput(
        "info",
        inputCheck.info,
        e
      );
    },
    fixProfOrgAgent: function (agent, orgId) {
      return {
        uid: agent.agentid,
        name: agent.name,
        info: agent.info,
        passHash: agent.password,
        phone: agent.mobile,
        orgId: orgId
      }
    },
    onAddProfOrgAgent: function(e) {
      let that = this;
      let orgId = util.getUserId();
      console.log('onAddProfOrgAgent: orgId: ', orgId);
      let newProfOrgAgentReq = {
        profOrgAgent: this.fixProfOrgAgent(this.data.newProfOrgAgent, orgId),
        rewardPlanId: this.data.selectedRewardPlan.id
      };
      let agentId = newProfOrgAgentReq.profOrgAgent.uid;
      this.showWaitingToast(true, '添加操作中...');
      datasrc.proforg.createNewProfOrgAgent(
        newProfOrgAgentReq,
        respData => {
          console.log('respData', respData);
          let { success, msg } = respData;
          that.showWaitingToast(false);

          if (success) {
            Toast.success({
              duration: 1000,
              message: `添加成功`,
              context: that
            });
          }
          else {
            Toast.fail({
              duration: 2000,
              message: `添加业务员[${agentId}]失败: ${msg}`,
              context: that
            });
          }
        }
      )
    }
  }
})
