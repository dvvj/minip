// pages/login/login-test.js
Page({

  /**
   * Page initial data
   */
  data: {
    username: null,
    password: null
  },
  onLogin: function(e) {
    console.log(e);
    let username = this.data.username;
    let password = this.data.password;
    console.log(`username: ${username}, password: ${password}`);
    wx.navigateTo({
      url: '../product/product-list',
    })
  },
  onInputUsername: function(e) {
    this.setData({username: e.detail})
  },
  onInputPassword: function (e) {
    this.setData({ password: e.detail })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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