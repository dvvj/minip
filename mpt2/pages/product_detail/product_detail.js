// pages/product_detail/product_detail.js
Page({

  /**
   * Page initial data
   */
  data: {

  },
  onBuy: function(e) {
    console.log('onBuy: ', e)
  },
  onAdd: function () {
    var newVal = this.data.sliderValue + 1
    this.setData({ sliderValue: newVal })
  },
  onMinus: function () {
    var newVal = this.data.sliderValue - 1
    this.setData({ sliderValue: newVal })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var selectedProductKey = 'selectedProduct'
    var selectedProduct = wx.getStorageSync(selectedProductKey)
    wx.removeStorageSync(selectedProductKey)
    console.log(selectedProductKey, selectedProduct)
    this.setData({
      productName: selectedProduct.name,
      productPrice: selectedProduct.price0
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