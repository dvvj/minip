// pages/mock/login.js
const util = require('../../utils/util.js')
const datasrc = require('../../utils/' + util.datasrc).datasrc;
const sessionTestUrl = util.webappBase + '/sessionTest';

Page({

  /**
   * Page initial data
   */
  data: {
    userid: 'c_o1a1p1c1',
    password: '123'
    // inProcess: false,
    // loadingText: ''
  },

  // setInProgress: function (isInProgress) {
  //   //this.updateNewCustomer("disabled", { detail: isInProgress });
  //   let loadingText = isInProgress ? '登录中...' : '';
  //   this.setData({
  //     inProcess: isInProgress,
  //     loadingText
  //   });
  //   //this.updateNewCustomer("loadingText", { detail: loadingText });
  // },

  onLogin: function (e) {
    let waitingToast = this.selectComponent("#waitingToast");
    let userid = this.data.userid;
    let password = this.data.password;
    console.log(`username: ${userid}, password: ${password}`);

    // this.setInProgress(true);
    waitingToast.show('登录中...');
    datasrc.login(
      userid, password,
      resp => {
        waitingToast.clear();
        let { success, msg } = resp;
        console.log('resp: ', resp);
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