// comp/new-medprof.js
const util = require('../utils/util.js');
const toastUtil = require('../utils/toast-util.js');
const inputCheck = require('../utils/input-check.js');
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
    newMedProf: {},
    errorMsgs: {},
    rewardPlans: [],
    rewardPlanInfos: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newMedProfData) {
      console.log('newMedProfData', newMedProfData);
      let { newMedProf, rewardPlans } = newMedProfData;
      let rewardPlanInfos = rewardPlans.map(p => p.info);
      let selectedRewardPlan = rewardPlans[0];
      this.setData({
        newMedProf, rewardPlans, rewardPlanInfos, selectedRewardPlan
      });
    },

    fixMedProf: function(medprof, agentId) {
      return {
        uid: medprof.profid,
        name: medprof.name,
        info: medprof.info,
        passHash: medprof.password,
        idCardNo: medprof.idCardNo,
        mobile: medprof.mobile,
        orgAgentId: agentId
      }
    },
    onAddMedProf: function(e) {
      let that = this;
      let userid = util.getUserId();
      console.log('onAddMedProf: agentid: ', userid);
      let newMedProfReq = {
        medprof: this.fixMedProf(this.data.newMedProf, userid),
        rewardPlanId: this.data.selectedRewardPlan.id
      };
      let profid = newMedProfReq.medprof.uid;
      toastUtil.waiting(this, true, '添加操作中...');
      datasrc.proforgagent.createNewMedProf(
        newMedProfReq,
        respData => {
          console.log('respData', respData);
          let { success, msg } = respData;
          toastUtil.waiting(that, false);

          if (success) {
            toastUtil.success(that, `添加成功`);
          }
          else {
            toastUtil.fail(that, `添加营养师[${profid}]失败: ${msg}`);
          }
        }
      )
    },
    onRewardPlanChange: function (e) {
      const { picker, value, index } = e.detail;
      let selectedRewardPlan = this.data.rewardPlans[index];
      console.log("reward plan changed: ", selectedRewardPlan);
      this.setData({ selectedRewardPlan });
    },

    updateNewMedProf: function (field, e) {
      var t = this.data.newMedProf;
      t[field] = e.detail;
      this.setData({ newMedProf: t });
    },
    updateErrorMsg: function (field, msg) {
      let errorMsgs = this.data.errorMsgs;
      errorMsgs[field] = msg;
      console.log('errorMsgs', errorMsgs);
      this.setData({ errorMsgs });
    },

    checkAndUpdateInput: function (field, checker, e) {
      let input = e.detail;
      this.updateNewMedProf(field, e)
      let err = checker.check(input);
      this.updateErrorMsg(field, err);
    },
    onInputUserId: function (e) {
      this.checkAndUpdateInput(
        "profid",
        inputCheck.profid,
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
      this.updateNewCustomer("password2", e)
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
  }
})
