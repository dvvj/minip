// comp/new-customer-info.js
const toastUtil = require('../utils/toast-util.js');
const util = require('../utils/util.js');
const registerUtil = require('../utils/register-util.js');
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
    newCustomer: {},
    errorMsgs: {},
    profileReq: {},
    field2Checker: {
      "userid": inputCheck.userid,
      "password": inputCheck.password,
      "password2": inputCheck.password,
      "userName": inputCheck.userName,
      "idCardNo": inputCheck.idCardNo,
      "mobile": inputCheck.mobile,
      "postAddr": inputCheck.postAddr,
    },
    isExistingCustomer: false,
    existingCustomer: {}
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (profId, newCustomer, profileReq) {
      let d = { profId, newCustomer, profileReq };
      console.log('initData', d);
      // let { newCustomer, profile, products, pricePlans } = newCustomerData;
      // let selected = products.filter(p => p.checked).map(p => p.shortName);
      // let pricePlanInfos = pricePlans.map(pp => pp.desc);
      // let selectedPricePlan = pricePlans[0];
      this.setData(d);
    },

    onSwitchExisting: function(e) {
      //console.log('in switch:', e);
      this.setData({ isExistingCustomer: e.detail} );
    },

    onInputExistingId: function(e) {
      let { uidOrMobile, ...others } = this.data.existingCustomer;
      let existingCustomer = { uidOrMobile: e.detail, ...others };
      this.setData({ existingCustomer });
    },

    onGetExistingCustomer: function() {
      let that = this;
      let queryReq = { idOrMobile: this.data.existingCustomer.uidOrMobile };
      console.log('[todo] onGetExistingCustomer', queryReq);

      toastUtil.waiting(this, true, '查询用户中')
      datasrc.registration.queryExistingCustomer(
        queryReq,
        respData => {
          toastUtil.waiting(that, false);
          console.log('respData', respData);

          if (respData.msg) {
            toastUtil.fail(that, respData.msg);
            let { uidOrMobile, ...others } = this.data.existingCustomer;
            let existingCustomer = { uidOrMobile };
            this.setData({ existingCustomer });
          }
          else {
            let existingCustomer = {
              uidOrMobile: this.data.existingCustomer.uidOrMobile,
              ...respData
            };
            this.setData({existingCustomer});
          }
          // let { success, msg } = respData;
          // let message = success ? '添加成功' : `添加失败: ${msg}`
          // success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
        }
      )
    },

    onRegisterCustomer: function (e) {
      if (this.checkAllInput()) {
        // let result = this.getData();
        // console.log('[todo] onRegisterCustomer: ', result)
        this.doRegisterCustomer();
      }
    },

    doRegisterCustomer: function () {
      let that = this;
      console.log('doRegisterCustomer: ');

      let { profId, newCustomer, profileReq } = this.data;
      let customer = registerUtil.convertCustomer(newCustomer);
      let newCustomerReq = { customer, profileReq };
      let registerCustomerReq = { profId, newCustomerReq };

      console.log('[todo] registerCustomerReq', registerCustomerReq);

      toastUtil.waiting(this, true, '添加用户中')
      datasrc.registration.registerCustomer(
        registerCustomerReq,
        respData => {
          toastUtil.waiting(this, false);
          console.log('respData', respData);
          let { success, msg } = respData;
          let message = success ? '添加成功' : `添加失败: ${msg}`
          success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
        }
      )
    },

    checkAllInput: function () {
      var hasError = false;
      for (var field in this.data.field2Checker) {
        let checker = this.data.field2Checker[field];
        console.log(`${field} checker: `, checker);
        let input = this.data.newCustomer[field];
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

    updateNewCustomer: function (field, e) {
      var t = this.data.newCustomer;
      t[field] = e.detail;
      this.setData({ newCustomer: t });
    },

    checkAndUpdateInput: function (field, e) {
      let input = e.detail;
      this.updateNewCustomer(field, e)
      let checker = this.data.field2Checker[field];
      let err = checker.check(input);
      this.updateErrorMsg(field, err);
    },

    onInputUserId: function (e) {
      this.checkAndUpdateInput("userid", e);
    },
    onInputPassword: function (e) {
      this.checkAndUpdateInput(
        "password",
        e
      );
      //this.updateNewCustomer("password", e)
    },
    onInputPassword2: function (e) {
      this.checkAndUpdateInput("password2", e)
    },
    onInputUserName: function (e) {
      this.checkAndUpdateInput(
        "userName",
        e
      );
      //this.updateNewCustomer("userName", e)
    },
    onInputIdCardNo: function (e) {
      //this.updateNewCustomer("idCardNo", e)
      this.checkAndUpdateInput(
        "idCardNo",
        e
      );
    },
    onInputMobile: function (e) {
      //this.updateNewCustomer("mobile", e)
      this.checkAndUpdateInput(
        "mobile",
        e
      );
    },
    onInputPostAddr: function (e) {
      //this.updateNewCustomer("postAddr", e)
      this.checkAndUpdateInput(
        "postAddr",
        e
      );
    },
    getUid: function() {
      return this.data.newCustomer.userid;
    }
  }
})
