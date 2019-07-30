// pages/tmp/cache-img-test.js
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
    wx.downloadFile({
      url: 'https://webapp.wonder4.life/product/1/1.jpg',
      success: function(res) {
        if (res.statusCode == 200) {
          console.log('success: ', res.tempFilePath);
          const fs = wx.getFileSystemManager();
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(fsres) {
              console.log('saved: ', fsres.savedFilePath);
              wx.setStorageSync('img_cache_file', fsres.savedFilePath);
            }
          })
        }
      },
      fail: function(err) {
        console.log('error downloading file, err:', err)
      }
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