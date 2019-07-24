// comp/new-medprof.js
import Toast from '../vant-lib/toast/toast';
const util = require('../utils/util.js');
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
      this.setData({
        newMedProf, rewardPlans, rewardPlanInfos
      });
    },
    onAddMedProf: function(e) {
      console.log('onAddMedProf: todo')
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

  }
})
