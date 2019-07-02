// comp/setting-customer.js
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
    customer: {},
    isMock: true
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (customer, isMock) {
      this.setData({
        isMock,
        customer
      });
    },

    updateNewCustomer: function (field, e) {
      var t = this.data.newCustomer;
      t[field] = e.detail;
      this.setData({ newCustomer: t });
    },
    onInputPassword: function (e) {
      this.updateNewCustomer("password", e)
    },
    onInputPassword2: function (e) {
      this.updateNewCustomer("password2", e)
    },
    onInputMobile: function (e) {
      this.updateNewCustomer("mobile", e)
    },
    onInputPostAddr: function (e) {
      this.updateNewCustomer("postAddr", e)
    },

  }
})
