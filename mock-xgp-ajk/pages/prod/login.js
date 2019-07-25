// pages/mock/login.js
const util = require('../../utils/util.js')
const datasrc = require('../../utils/' + util.datasrc).datasrc;
const sessionTestUrl = util.webappBase + '/sessionTest';
const toastUtil = require('../../utils/toast-util.js');

Page({

  /**
   * Page initial data
   */
  data: {
    userid: 'a_o1a1',
    password: '123'
  },

  onLogin: function (e) {
    let userid = this.data.userid;
    let password = this.data.password;
    console.log(`username: ${userid}, password: ${password}`);
    let that = this;

    // this.setInProgress(true);
    toastUtil.waiting(this, true, '登录中...');
    datasrc.login(
      userid, password,
      resp => {
        let { success, msg } = resp;
        console.log('resp: ', resp);
        toastUtil.waiting(that, false);

        if (!success) {
          toastUtil.fail(that, `登录失败: ${msg}`);
        }
        // this.setInProgress(false);
      }
    );
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