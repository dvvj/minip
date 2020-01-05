// pages/prod/login-or-register.js
const util = require('../../utils/util.js');
const cacheUtil = require('../../utils/cache-util.js');
const toastUtil = require('../../utils/toast-util.js');

const tabIndices = {
  login: 0,
  register: 1,
  serverSetting: 2
};

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: tabIndices.login,
    webappBase: 'https://webapp.wonder4.life'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    //cacheUtil.clearCache4Demo();
    let loginComp = this.selectComponent("#loginComp");
    //loginComp.initData('p-prof', '123');
    console.log('Options: ', options);
    if (options.er) {
      const msg = `${options.er} 请重新登录`;
      toastUtil.fail(this, msg);
    }
    else if (options.su) {
      const suid = options.su;
      loginComp.initData(suid, '');
    }
    else {
      // loginComp.initData('p-prof', '123');
      loginComp.initData('', '');
    }
    
  },

  onPostRegistration: function(e) {
    console.log('in onPostRegistration:', e);
    let uid = e.detail;
    let activeTabIndex = tabIndices.login;
    this.setData({activeTabIndex});
    let loginComp = this.selectComponent("#loginComp");
    loginComp.initData(uid, '');
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