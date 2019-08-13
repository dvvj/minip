// pages/prod/login-or-register.js
const util = require('../../utils/util.js');
const cacheUtil = require('../../utils/cache-util.js');

Page({

  /**
   * Page initial data
   */
  data: {
    webappBase: 'https://webapp.ajkhealth.com'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    //cacheUtil.clearCache4Demo();
    let loginComp = this.selectComponent("#loginComp");
    loginComp.initData('p-prof', '123');
    
  },

  onInputWebappBaseUrl: function(e) {
    let newUrl = e.detail;
    this.setData({ webappBase: newUrl });
  },
  onSetWebappBaseUrl: function() {
    console.log('setting webappBase to ', this.data.webappBase);
    util.setWebappBase(this.data.webappBase);
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