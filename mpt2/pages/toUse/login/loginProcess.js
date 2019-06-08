// pages/toUse/login/loginProcess.js
const promisify = original => {
  return function (opt) {
    return new Promise((resolve, reject) => {
      opt = Object.assign({
        success: resolve,
        fail: reject
      }, opt)
      original(opt)
    })
  }
}

Page({

  /**
   * Page initial data
   */
  data: {

  },
  onLogin00: function(e) {
    promisify(wx.login)()
      .then(({code}) => {
        console.log(`code: ${code}`)
        var codeurl = `https://api.weixin.qq.com/sns/jscode2session?appid=wxcce411c146c16195&secret=e21776bd46975d76abb9d2d91e681e17&js_code=${code}&grant_type=authorization_code`
        wx.request({
          url: codeurl,
          success: function(e) {
            console.log('success', e)
          }
        })
      })
  },
  onLogin: function (e) {
    promisify(wx.login)()
      .then(({ code }) => {
        console.log(`code: ${code}`)
        var loginUrl = 'https://webapp.wonder4.life:443/wxlogin'
        wx.request({
          url: loginUrl,
          method: 'POST',
          data: {
            wxCode: code,
            userTypeName: 'Customer:o1a1p1_customer1',
            userPass: '123'
          },
          success: function (e) {
            console.log('success', e)
          }
        })
      })
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