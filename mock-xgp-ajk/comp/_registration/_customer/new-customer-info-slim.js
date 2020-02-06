// comp/_registration/_customer/new-customer-info-slim.js
const toastUtil = require('../../../utils/toast-util.js');
const util = require('../../../utils/util.js');
const registerUtil = require('../../../utils/register-util.js');
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
    newCustomer: {},
    errorMsgs: {},
    profileReq: {},
    field2Checker: {
      "mobile": inputCheck.mobile
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

    onSwitchExisting: function (e) {
      //console.log('in switch:', e);
      this.setData({ isExistingCustomer: e.detail });
    },

    doRegisterExistingCustomer: function (e) {
      let that = this;
      console.log('doRegisterExistingCustomer: ');

      let existingCustomerInfo = this.selectComponent('#existingCustomerInfo');
      let { profId, profileReq } = this.data;
      let existingCustomer = existingCustomerInfo.getExistingCustomer();

      const mobile = existingCustomer.cidOrMobile;
      const productIds = profileReq.productIds;
      //let customer = registerUtil.convertCustomer(newCustomer);
      let existingCustomerReq = {
        profOrAgentId: profId,
        mobile,
        productIds
      };

      console.log('[todo] existingCustomerReq', existingCustomerReq);

      toastUtil.waiting4dlg(this, true, '注册已有用户中')
      datasrc.registration.registerExistingCustomer(
        existingCustomerReq,
        respData => {
          toastUtil.waiting4dlg(this, false);
          console.log('respData', respData);
          let { success, msg } = respData;
          let message = success ? '注册成功' : `注册失败: ${msg}`
          success ? toastUtil.success4dlg(that, message) : toastUtil.fail4dlg(that, message);
        }
      )
    },

    onRegisterCustomer: function (e) {
      if (this.checkAllInput()) {
        if (!this.data.isExistingCustomer) {
          this.doRegisterCustomer();
        }
        else {
          this.doRegisterExistingCustomer();
        }
      }
    },

    doRegisterCustomer: function () {
      let that = this;
      console.log('doRegisterCustomer: ');

      let { profId, newCustomer, profileReq } = this.data;
      let customer = registerUtil.convertCustomer(newCustomer);
      //let newCustomerReq = { customer, profileReq };

      const {mobile} = customer;
      const {productIds} = profileReq;
      let registerCustomerReq = { profAgentId: profId, mobile, productIds };

      console.log('[todo] registerCustomerReq', registerCustomerReq);

      toastUtil.waiting4dlg(this, true, '添加用户中')
      datasrc.registration.registerCustomer(
        registerCustomerReq,
        respData => {
          toastUtil.waiting4dlg(this, false);
          console.log('respData', respData);
          let { success, msg } = respData;
          let message = success ? '添加成功' : `添加失败: ${msg}`
          success ? toastUtil.success4dlg(that, message) : toastUtil.fail4dlg(that, message);
        }
      )
    },

    checkAllInput: function () {
      var hasError = false;
      if (!this.data.isExistingCustomer) {
        for (var field in this.data.field2Checker) {
          let checker = this.data.field2Checker[field];
          console.log(`${field} checker: `, checker);
          let input = this.data.newCustomer[field];
          let err = checker.check(input);
          this.updateErrorMsg(field, err);
          if (err != inputCheck.MsgNoError) hasError = true;
        }
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

    onInputMobile: function (e) {
      //this.updateNewCustomer("mobile", e)
      this.checkAndUpdateInput(
        "mobile",
        e
      );
    },

    // getUid: function () {
    //   return this.data.isExistingCustomer ? this.data.existingCustomer.cidOrMobile : this.data.newCustomer.userid;
    // },
    // getMobile: function () {
    //   return this.data.isExistingCustomer ? this.data.existingCustomer.cidOrMobile : this.data.newCustomer.mobile;
    // },

    getUidOrMobile: function() {
      if (this.data.isExistingCustomer) {
        return this.data.existingCustomer.cidOrMobile;
      }
      else {
        let newCustomer = this.data.newCustomer;
        let uidOrMobile = newCustomer.userid ? newCustomer.userid : newCustomer.mobile;
        if (typeof(uidOrMobile) === 'undefined')
          return "";
        else
          return uidOrMobile;
      }
    }
  }
})
