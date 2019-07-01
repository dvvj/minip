// comp/new-customer-profile.js
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
    profile: {},
    products: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (customerAndProfile, products) {
      let selected = products.filter(p => p.checked).map(p => p.name);
      this.setData({
        newCustomer: customerAndProfile.newCustomer,
        profile: customerAndProfile.profile,
        products,
        selected
      });
    },
    getData: function () {
      let { newCustomer, profile, products, selected } = this.data;
      let selectedProducts = products.filter(p => p.enabled && selected.includes(p.name));
      return { newCustomer, profile, selectedProducts };
    },
    onChange(event) {
      console.log('event: ', event)

      this.setData({
        selected: event.detail
      });
    },
    onNewCustomerProfile: function(e) {
      let result = this.getData();
      console.log('[todo] onNewCustomerProfile: ', result)
    }
  }
})
