// comp/reffed-customer-infos.js
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
    }
  }
})
