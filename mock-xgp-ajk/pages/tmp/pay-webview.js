// pages/tmp/pay-webview.js
Page({

  /**
   * Page initial data
   */
  data: {
    payUrl: 'https//todo'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let payReqUrl = wx.getStorageSync('payReqUrl');
    console.log('payReqUrl: ', payReqUrl)
    this.setData({payUrl: payReqUrl})
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