// pages/mock/login.js
const util = require('../../utils/util.js')

const sessionTestUrl = util.webappBase + '/sessionTest';

Page({

  /**
   * Page initial data
   */
  data: {
    userid: 'o_o1',
    password: '123'
  },
  onLogin: function (e) {
    console.log(e);
    let userid = this.data.userid;
    let password = this.data.password;
    console.log(`username: ${userid}, password: ${password}`);

    wx.navigateTo({
      url: './customer/customer_main',
      //url: './proforg/proforg_main',
      //url: './medprof/medprof_main',
    })
  },
  onInputUserId: function (e) {
    this.setData({ userid: e.detail })
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