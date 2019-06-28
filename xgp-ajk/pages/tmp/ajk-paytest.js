// pages/tmp/ajk-paytest.js
const util = require('../../utils/util.js')

let wxPayezTestUrl = util.webappBase + "/wx/wepayezTest"

Page({

  /**
   * Page initial data
   */
  data: {
    userid: 'p_o1a1p1',
    password: '123'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  onLogin: function (e) {
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
            //const tokens = { xauth: e.header[util.xAuthHeader], accessToken: e.data.access_token };
            util.saveTokens(e);

            let tokens = wx.getStorageSync(util.userTokenKey);            
            wx.request({
              url: wxPayezTestUrl,
              method: "GET",
              header: util.getJsonReqHeader(tokens),
              success: function (r2) {
                console.log('r2: ', r2)
              },
              fail: function (e2) {
                console.info("e2: ", e2)
              }
            })
          }
        })
      })
      .catch(function (reason) {
        console.log('failed, reason: ', reason)
      })
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