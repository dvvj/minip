// pages/login/login-medprof.js
const util = require('../../utils/util.js')

Page({

  /**
   * Page initial data
   */
  data: {
    username: 'o1a1_prof1',
    password: '123'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  onLogin: function (e) {
    console.log(e);
    let username = this.data.username;
    let password = this.data.password;
    console.log(`username: ${username}, password: ${password}`);

    wx.navigateTo({
      url: '../customer/reffed-customers',
    })
    // util.promisify(wx.login)()
    //   .then(({ code }) => {
    //     console.log(`code: ${code}`)
    //     wx.request({
    //       url: util.loginUrl,
    //       method: 'POST',
    //       data: {
    //         wxCode: code,
    //         userTypeName: 'MedProf:' + username,
    //         userPass: password
    //       },
    //       success: function (e) {
    //         console.log('success', e)
    //         const tokens = { xauth: e.header[xAuthHeader], accessToken: e.data.access_token };
    //         wx.setStorage({
    //           key: "tokens",
    //           data: tokens,
    //           success: function (res) {
    //             console.log("tokens saved: ", res)
    //           },
    //           fail: function (err) {
    //             console.log("failed to save tokens: ", err)
    //           }
    //         })
    //         wx.navigateTo({
    //           url: '../customer/reffed-customers',
    //         })
    //       }
    //     })
    //   })
    //   .catch(function (reason) {
    //     console.log('failed, reason: ', reason)
    //   })
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