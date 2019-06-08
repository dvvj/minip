// pages/paytest/paytest.js
Page({

  /**
   * Page initial data
   */
  data: {

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
    wx.login({
      success: function (res) {
        console.log("res: ", res)
        if (res.code) {
          wx.request({
            url: 'https://app.wonder4.life/webapi/wxPay/loginReq',
            data: {
              userId: 'todo',
              loginCode: res.code
            },
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            success: function (r) {
              console.log('r: ', r)
              console.log(r.data.openid)
              console.log(r.data.session_key)
              wx.request({
                url: 'https://app.wonder4.life/webapi/wxPay/payReqMP',
                data: {
                  userId: 'todo',
                  openid: r.data.openid,
                  prodId: 'prod001',
                  amount: 1,
                  info: 'todo-info'
                },
                method: "POST",
                header: {
                  'content-type': 'application/json'
                },
                success: function (r2) {
                  console.log('r2: ', r2)
                  wx.requestPayment({
                    'timeStamp': r2.data.timeStamp,
                    'nonceStr': r2.data.nonceStr,
                    'package': r2.data.package_,
                    'signType': 'MD5',
                    'paySign': r2.data.paySign,
                    success: function (r3) {
                      console.info('r3: ', r3)
                      //报名
                      //goApply(event, that)
                    },
                    fail: function (e3) {
                      console.info("e3: ", e3)
                    },
                    complete: function (c3) {
                      console.info("c3: ", c3)
                    }
                  })
                }
              }
              )
            },
            fail: function (r) {
              console.log('error getting openid, session_key', r)
            }
          })
        }
        else {
          console.log('failed to login', res)
        }
      },
      fail: function (r) {
        console.log('failed to login: ', r)
      }
    })

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