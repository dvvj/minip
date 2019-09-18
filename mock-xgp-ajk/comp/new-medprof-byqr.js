// comp/new-medprof-byqr.js
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
    rewardPlanId: '',
    field2Checker: {
      "profid": inputCheck.profid,
      "password": inputCheck.password,
      "password2": inputCheck.password,
      "name": inputCheck.name,
      "mobile": inputCheck.mobile,
      "info": inputCheck.info,
    },
    agentId: null
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newMedProfData, agentId) {
      console.log('newMedProfData/agentId: ', newMedProfData, agentId);
      let { newMedProf, rewardPlanId } = newMedProfData;
      this.setData({
        agentId,
        newMedProf, rewardPlanId
      });
    },

    fixMedProf: function (medprof, agentId) {
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
    onAddMedProf: function (e) {
      if (!this.checkAllError()) {
        console.log("has input error(s)");
      }
      else {
        let that = this;
        let agentId = this.data.agentId;
        console.log('onAddMedProf: agentid: ', agentId);
        let newMedProfReq = {
          medprof: this.fixMedProf(this.data.newMedProf, agentId),
          rewardPlanId: this.data.rewardPlanId
        };
        let profid = newMedProfReq.medprof.uid;
        toastUtil.waiting(this, true, '添加操作中...');
        datasrc.registration.registerMedProf(
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
        );
      }
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

    checkAllError: function () {
      var hasError = false;
      for (var field in this.data.field2Checker) {
        let checker = this.data.field2Checker[field];
        console.log(`${field} checker: `, checker);
        let input = this.data.newMedProf[field];
        let err = checker.check(input);
        this.updateErrorMsg(field, err);
        if (err != inputCheck.MsgNoError) hasError = true;
      }
      return !hasError;
    },

    checkAndUpdateInput: function (field, e) {
      let input = e.detail;
      this.updateNewMedProf(field, e);
      let checker = this.data.field2Checker[field];
      //console.log('checker: ', checker);
      let err = checker.check(input);
      this.updateErrorMsg(field, err);
    },
    onInputUserId: function (e) {
      this.checkAndUpdateInput(
        "profid",
        e
      );
    },
    onInputPassword: function (e) {
      this.checkAndUpdateInput(
        "password",
        e
      );
    },
    onInputPassword2: function (e) {
      this.checkAndUpdateInput("password2", e)
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
    getUid: function() {
      return this.data.newMedProf.profid;
    }
  }
})
