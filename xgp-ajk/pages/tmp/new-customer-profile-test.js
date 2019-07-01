// pages/tmp/new-customer-profile-test.js
Page({

  /**
   * Page initial data
   */
  data: {
    newCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'newcustomer02',
      password: '123',
      password2: '123',
      userName: 'x某',
      idCardNo: '310112197003113333',
      mobile: '137000333333',
      postAddr: '某省某市某区某路xx号 邮编111111',
    },
    profile: {
      healthTags: 'healthTags',
      medicineTags: 'medicineTags'
    },
    products: [
      { id: 1, name: 'Astaxin虾青素', enabled: true, checked: false },
      { id: 2, name: 'ACO复合维生素', enabled: true, checked: false },
      { id: 3, name: '辅酶Q10', enabled: false, checked: true }
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let newCustomerProfile = this.selectComponent("#newCustomerProfile");
    console.log(newCustomerProfile);
    newCustomerProfile.initData({
      newCustomer: this.data.newCustomer,
      profile: this.data.profile
    }, this.data.products);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})