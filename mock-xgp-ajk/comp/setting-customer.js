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
    isMock: true
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
