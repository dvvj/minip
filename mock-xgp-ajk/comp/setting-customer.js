// comp/setting-customer.js
const util = require('../utils/util.js');
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
    disabled: false,
    loadingText: '',
    customer: {},
    isMock: true,
    errorMsgs: {
      passwordCannotBeEmpty: '密码不能为空',
      passwordsNotMatch: '两次输入密码不匹配'
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
      console.log('[onUpdateSetting]: ', this.data.customer);
      datasrc.customer.updateSetting(
        this.data.customer,
        resp => {
          console.log(resp);
        }
      )
    }
  }
})
