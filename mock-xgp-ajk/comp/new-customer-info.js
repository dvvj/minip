// comp/new-customer-info.js
const toastUtil = require('../utils/toast-util.js');
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
    newCustomer: {},
    errorMsgs: {},
    profileReq: {},
    field2Checker: {
      "userid": inputCheck.userid,
      "password": inputCheck.password,
      "userName": inputCheck.userName,
      "idCardNo": inputCheck.idCardNo,
      "mobile": inputCheck.mobile,
      "postAddr": inputCheck.postAddr,
    }
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newCustomer, profileReq) {
      console.log('newCustomer', newCustomer);
      console.log('profileReq', profileReq);
      // let { newCustomer, profile, products, pricePlans } = newCustomerData;
      // let selected = products.filter(p => p.checked).map(p => p.shortName);
      // let pricePlanInfos = pricePlans.map(pp => pp.desc);
      // let selectedPricePlan = pricePlans[0];
      this.setData({ newCustomer, profileReq });
    },

    onRegisterCustomer: function (e) {
      if (this.checkAllInput()) {
        let result = this.getData();
        console.log('[todo] onRegisterCustomer: ', result)
        this.createNewCustomerProfile();
      }
    },

    createNewCustomerProfile: function () {
      let that = this;
      console.log('createNewCustomerProfile: ');

      let newCustomerReq = {
        customer, profileReq
      };

      console.log('[todo] newCustomerReq', newCustomerReq);

      // toastUtil.waiting(this, true, '添加用户中')
      // datasrc.medprof.createNewCustomerAndProfile(
      //   newCustomerReq,
      //   respData => {
      //     toastUtil.waiting(this, false);
      //     console.log('respData', respData);
      //     let { success, msg } = respData;
      //     let message = success ? '添加成功' : `添加失败: ${msg}`
      //     success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
      //   }
      // )
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
      this.updateNewCustomer("password2", e)
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

  }
})
