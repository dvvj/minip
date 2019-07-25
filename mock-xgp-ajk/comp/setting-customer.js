// comp/setting-customer.js
const util = require('../utils/util.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;
const toastUtil = require('../utils/toast-util.js');

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
    disabled: false,
    loadingText: '',
    customer: {},
    isMock: true,
    errorMsgs: {
      passwordCannotBeEmpty: '密码不能为空',
      passwordsNotMatch: '两次输入密码不匹配',
      mobileCannotBeEmpty: '手机号不能为空',
      mobileFormatError: '手机号格式不正确',
      postAddrCannotBeEmpty: '邮寄地址不能为空'
    },
    errors: {
      password: '',
      password2: '',
      mobile: '',
      postAddr: ''
    }
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (isMock, customer) {
      this.setData({
        isMock,
        customer
      });
    },

    updateNewCustomer: function (field, e) {
      var t = this.data.customer;
      t[field] = e.detail;
      this.setData({ customer: t });
      this.updateAllErrors();
    },
    updateError: function(field, errorMsg) {
      var t = this.data.errors;
      t[field] = errorMsg;
      this.setData({ errors: t});
    },
    checkPasswordMatch: function() {
      return this.data.customer.password === this.data.customer.password2;
    },
    updateAllErrors: function() {
      this.updateError(
        'password2',
        this.checkPasswordMatch() ? '' : this.data.errorMsgs.passwordsNotMatch
      );
      this.updateError(
        'password',
        this.data.customer.password ? '' : this.data.errorMsgs.passwordCannotBeEmpty
      );
    },
    onInputPassword: function (e) {
      this.updateNewCustomer("password", e);
    },
    onInputPassword2: function (e) {
      this.updateNewCustomer("password2", e);
    },
    onInputMobile: function (e) {
      this.updateNewCustomer("mobile", e);
    },
    onInputPostAddr: function (e) {
      this.updateNewCustomer("postAddr", e);
    },
    onUpdateSetting: function(e) {
      let that = this;
      console.log('[onUpdateSetting]: ', this.data.customer);
      toastUtil.waiting(that, true, '更新中...');
      datasrc.customer.updateSetting(
        this.data.customer,
        resp => {
          let { success, msg } = resp;
          console.log(resp);
          toastUtil.waiting(this, false);
          success ? toastUtil.success(that, '更新成功') : toastUtil.fail(that, msg);
        }
      )
    }
  }
})
