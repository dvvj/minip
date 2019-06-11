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
};

const webappBase = 'https://webapp.wonder4.life:8443';
const xAuthHeader = 'X-Auth-Token'
const customerProductUrl = webappBase + '/customerProductView'
const loginUrl = webappBase + '/wxlogin';
const sessionTestUrl = webappBase + '/sessionTest';
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
            const tokens = { xauth: e.header[xAuthHeader], accessToken: e.data.access_token };
            console.log('X-Auth-Token', tokens.xauth)
            console.log('token', tokens.accessToken)

            // wx.request({
            //   url: sessionTestUrl,
            //   method: 'GET',
            //   header: {
            //     'Authorization': 'Bearer ' + tokens.accessToken,
            //     'X-Auth-Token': tokens.xauth
            //   },
            //   success: function (r) {
            //     console.log('r:', r)
            //   }
            // })
            
            wx.request({
              url: customerProductUrl,
              method: 'GET',
              header: {
                'Authorization': 'Bearer ' + tokens.accessToken,
                'X-Auth-Token': tokens.xauth
              },
              success: function (r1) {
                console.log('r1:', r1)
              }
            })
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