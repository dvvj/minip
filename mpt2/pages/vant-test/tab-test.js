// pages/vant-test/tab-test.js
Page({

  /**
   * Page initial data
   */
  data: {
    active: 1,
    swiperCurrent: 1
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },
  onChange: function (e) {
    console.log(e)
    wx.showToast({
      title: `切换到标签 ${e.detail}`,
      icon: 'none'
    });
    this.setData({ swiperCurrent: e.detail })
  },
  swiperChange: function(e) {
    console.log(e.detail.current)
    this.setData({active: e.detail.current})
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