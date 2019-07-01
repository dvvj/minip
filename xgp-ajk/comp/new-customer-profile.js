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
      console.log('customerAndProfile: ', customerAndProfile)
      this.setData({
        newCustomer: customerAndProfile.newCustomer,
        profile: customerAndProfile.profile,
        products
      });
    },
    getData: function () {
      let { newCustomer, profile } = this.data;
      return { newCustomer, profile };
    },
    onChange(event) {
      console.log(event)
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
    },
  }
})
