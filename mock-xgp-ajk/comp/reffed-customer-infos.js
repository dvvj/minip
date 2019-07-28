// comp/reffed-customer-infos.js
const util = require('../utils/util.js');

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
    customerInfos: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(customerInfos) {
      this.setData({ customerInfos });
    },

    onAddNewCustomerClicked: function(e) {
      console.log('onAddNewCustomerClicked, triggering event gotoAddNewCustomer');
      this.triggerEvent('gotoAddNewCustomer');
    },

    onClick: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currCustomer = this.data.customerInfos[idx];
      console.log('currCustomer', currCustomer);
      wx.setStorageSync(util.currCustomerKey, currCustomer)
    }
  }
})
