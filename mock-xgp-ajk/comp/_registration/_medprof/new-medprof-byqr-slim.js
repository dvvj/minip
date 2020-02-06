// comp/_registration/_medprof/new-medprof-byqr-slim.js
const util = require('../../../utils/util.js');
const toastUtil = require('../../../utils/toast-util.js');
const inputCheck = require('../../../utils/input-check.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;


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
      "name": inputCheck.name,
      "mobile": inputCheck.mobile
    },
    agentId: null
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newMedProfData, agentId) {
      console.log('newMedProfData/agentId: ', newMedProfData, agentId);
      let { newMedProf, rewardPlanId, rewardPlanInfo } = newMedProfData;
      this.setData({
        agentId,
        newMedProf,
        rewardPlanId,
        rewardPlanInfo
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
        const { name, mobile } = this.data.newMedProf;
        let newMedProfReq = {
          //medprof: this.fixMedProf(this.data.newMedProf, agentId),
          agentId,
          name,
          mobile,
          rewardPlanId: this.data.rewardPlanId
        };
        console.log('onAddMedProf: ', newMedProfReq);
        //let profid = newMedProfReq.medprof.uid;
        toastUtil.waiting4dlg(this, true, '添加操作中...');
        datasrc.registration.registerMedProfMobileNameOnly(
          newMedProfReq,
          respData => {
            console.log('respData', respData);
            let { success, msg } = respData;
            toastUtil.waiting4dlg(that, false);

            if (success) {
              toastUtil.success4dlg(that, `添加成功`);
            }
            else {
              toastUtil.fail4dlg(that, `添加营养师[${name}]失败: ${msg}`);
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
    getUidOrMobile: function () {
      let newMedProf = this.data.newMedProf;
      let uidOrMobile = newMedProf.userid ? newMedProf.userid : newMedProf.mobile;
      if (typeof (uidOrMobile) === 'undefined')
        return "";
      else
        return uidOrMobile;
    },
  }
})

