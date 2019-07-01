// pages/login/login-test.js
const util = require('../../utils/util.js')

const sessionTestUrl = util.webappBase + '/sessionTest';

Page({

  /**
   * Page initial data
   */
  data: {
    userid: 'c_o1a1p1c1',
    password: '123'
  },
  onLogin: function(e) {
    console.log(e);
    let userid = this.data.userid;
    let password = this.data.password;
    console.log(`username: ${userid}, password: ${password}`);
    
    util.promisify(wx.login)()
      .then(({ code }) => {
        console.log(`code: ${code}`)
        wx.request({
          url: util.loginUrl,
          method: 'POST',
          data: {
            wxCode: code,
            userId: userid,
            userPass: password
          },
          success: function (e) {
            console.log('login success', e)
            // const tokens = { xauth: e.header[xAuthHeader], accessToken: e.data.access_token };
            util.saveTokens(e);
            wx.navigateTo({
              url: '../product/product-list',
            })
          }
        })
      })
      .catch(function(reason) {
        console.log('failed, reason: ', reason)
      })
  },
  onInputUserId: function(e) {
    this.setData({ userid: e.detail})
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