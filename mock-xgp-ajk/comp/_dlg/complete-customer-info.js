// comp/_dlg/complete-customer-info.js
const toastUtil = require('../../utils/toast-util.js');
const util = require('../../utils/util.js');
const registerUtil = require('../../utils/register-util.js');
const inputCheck = require('../../utils/input-check.js');
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
    currCustomer: {},
    errorMsgs: {},
    field2Checker: {
      "userName": inputCheck.userName,
      "idCardNo": inputCheck.idCardNo,
      "postAddr": inputCheck.postAddr
    }
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (currCustomer) {
      console.log('initData', currCustomer);
      this.setData({ currCustomer });
    },

    onCompleteCustomerInfo: function () {
      let that = this;
      console.log('onCompleteCustomerInfo: ');

      let customerInfoReq = this.data.currCustomer;

      console.log('[todo] customerInfoReq', customerInfoReq);

      toastUtil.waiting4dlg(this, true, '资料提交中');
      datasrc.customer.completeInfo(
        customerInfoReq,
        respData => {
          toastUtil.waiting4dlg(that, false);
          console.log('respData', respData);
          let { success, msg } = respData;
          let message = success ? '更新成功' : `更新失败: ${msg}`
          success ? toastUtil.success4dlg(that, message) : toastUtil.fail4dlg(that, message);
        }
      )
    },

    checkAllInput: function () {
      var hasError = false;
      for (var field in this.data.field2Checker) {
        let checker = this.data.field2Checker[field];
        console.log(`${field} checker: `, checker);
        let input = this.data.currCustomer[field];
        let err = checker.check(input);
        this.updateErrorMsg(field, err);
        if (err != inputCheck.MsgNoError) hasError = true;
      }
      return !hasError;
    },
    updateErrorMsg: function (field, msg) {
      let errorMsgs = this.data.errorMsgs;
      errorMsgs[field] = msg;
      console.log('errorMsgs', errorMsgs);
      this.setData({ errorMsgs });
    },

    updateCurrCustomer: function (field, e) {
      var t = this.data.currCustomer;
      t[field] = e.detail;
      this.setData({ currCustomer: t });
    },

    checkAndUpdateInput: function (field, e) {
      let input = e.detail;
      this.updateCurrCustomer(field, e)
      let checker = this.data.field2Checker[field];
      let err = checker.check(input);
      this.updateErrorMsg(field, err);
    },

    onInputPassword2: function (e) {
      this.checkAndUpdateInput("password2", e)
    },
    onInputUserName: function (e) {
      this.checkAndUpdateInput(
        "userName",
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
    onInputPostAddr: function (e) {
      this.checkAndUpdateInput(
        "postAddr",
        e
      );
    }
  }
})
