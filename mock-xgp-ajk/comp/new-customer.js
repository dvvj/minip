// comp/new-customer.js
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
    newCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'newcustomer01',
      password: '123',
      password2: '123',
      userName: '张某',
      idCardNo: '310112197003113821',
      mobile: '13700011100',
      postAddr: '某省某市某区某路xx号 邮编102011',
    },
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(customer) {
      this.setData({newCustomer: customer});
    },
    getData: function() {
      return this.data.newCustomer;
    }
  }
})
