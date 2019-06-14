// pages/login/login-medprof.js
const util = require('../../utils/util.js')

Page({

  /**
   * Page initial data
   */
  data: {
    medprofid: 'o1a1_prof1',
    password: '123'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },
  onLogin: function (e) {
    console.log(e);
    let medprofid = this.data.medprofid;
    let password = this.data.password;
    console.log(`medprofid: ${medprofid}, password: ${password}`);

    util.promisify(wx.login)()
      .then(({ code }) => {
        console.log(`code: ${code}`)
        wx.request({
          url: util.loginUrl,
          method: 'POST',
          data: {
            wxCode: code,
            userTypeName: 'MedProf:' + medprofid,
            userPass: password
          },
          success: function (e) {
            console.log('success', e)
            // const tokens = { xauth: e.header[util.xAuthHeader], accessToken: e.data.access_token };
            util.saveTokens(e.header[util.xAuthHeader], e.data.access_token);
            wx.navigateTo({
              url: '../customer/reffed-customers',
            })
          }
        })
      })
      .catch(function (reason) {
        console.log('failed, reason: ', reason)
      })
  },
  onInputMedProfId: function (e) {
    this.setData({ medprofid: e.detail })
  },
  onInputPassword: function (e) {
    this.setData({ password: e.detail })
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