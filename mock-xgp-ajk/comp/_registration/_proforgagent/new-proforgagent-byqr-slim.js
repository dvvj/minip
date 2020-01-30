// comp/_registration/_proforgagent/new-proforgagent-byqr-slim.js
const util = require('../../../utils/util.js');
const inputCheck = require('../../../utils/input-check.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;
const toastUtil = require('../../../utils/toast-util.js');

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
    rewardPlansId: '',
    field2Checker: {
      "name": inputCheck.name,
      "mobile": inputCheck.mobile,
      "info": inputCheck.info,
    }
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newProfOrgAgentData, orgId) {
      console.log('newProfOrgAgentData/orgId', newProfOrgAgentData, orgId);
      let { newProfOrgAgent, rewardPlanId, rewardPlanInfo } = newProfOrgAgentData;
      this.setData({
        orgId,
        newProfOrgAgent,
        rewardPlanId,
        rewardPlanInfo
      });
    },
    // getUid: function () {
    //   return this.data.newProfOrgAgent.agentid;
    // },
    getUidOrMobile: function () {
      let newProfOrgAgent = this.data.newProfOrgAgent;
      let uidOrMobile = newProfOrgAgent.userid ? newProfOrgAgent.userid : newProfOrgAgent.mobile;
      if (typeof (uidOrMobile) === 'undefined')
        return "";
      else
        return uidOrMobile;
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
    checkAndUpdateInput: function (field, e) {
      let input = e.detail;
      this.updateNewProfOrgAgent(field, e)
      let checker = this.data.field2Checker[field];
      let err = checker.check(input);
      this.updateErrorMsg(field, err);
    },

    onInputUserName: function (e) {
      this.checkAndUpdateInput(
        "name",
        e
      );
    },
    onInputIdCardNo: function (e) {
      this.checkAndUpdateInput(
        "idCardNo",
        e
      );
    },
    onInputMobile: function (e) {
      this.checkAndUpdateInput(
        "mobile",
        e
      );
    },
    onInputInfo: function (e) {
      this.checkAndUpdateInput(
        "info",
        e
      );
    },
    fixProfOrgAgent: function (agent, orgId) {
      return {
        //uid: agent.agentid,
        name: agent.name,
        //info: agent.info,
        //passHash: agent.password,
        mobile: agent.mobile,
        orgId: orgId
      }
    },

    checkAllError: function () {
      var hasError = false;
      for (var field in this.data.field2Checker) {
        let checker = this.data.field2Checker[field];
        console.log(`${field} checker: `, checker);
        let input = this.data.newProfOrgAgent[field];
        let err = checker.check(input);
        this.updateErrorMsg(field, err);
        if (err != inputCheck.MsgNoError) hasError = true;
      }
      return !hasError;
    },
    onAddProfOrgAgent: function (e) {

      if (!this.checkAllError()) {
        console.log('has input error(s)');
      }
      else {
        let that = this;
        let orgId = this.data.orgId; //util.getUserId();
        const agentInfo = this.fixProfOrgAgent(this.data.newProfOrgAgent, orgId);
        let newProfOrgAgentReq = {
          ...agentInfo,
          rewardPlanId: this.data.rewardPlanId
        };
        console.log('onAddProfOrgAgent: orgId: ', orgId, newProfOrgAgentReq);
        toastUtil.waiting4dlg(this, true, '添加操作中...');
        datasrc.registration.registerProfOrgAgentMobileNameOnly(
          newProfOrgAgentReq,
          respData => {
            console.log('respData', respData);
            let { success, msg } = respData;
            toastUtil.waiting4dlg(that, false);

            if (success) {
              toastUtil.success4dlg(that, `添加成功`);
            }
            else {
              let agentId = this.data.newProfOrgAgent.agentid;
              toastUtil.fail4dlg(that, `添加业务员[${agentId}]失败: ${msg}`);
            }
          }
        )
      }
    }
  }
})
