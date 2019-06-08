// pages/product_detail/product_detail.js

let roundPrice = function(price) {
  var p100 = Math.round(price*100)
  return p100 / 100.0;
}

Page({

  /**
   * Page initial data
   */
  data: {
    sliderValue: 1,
    min: 1,
    max: 100
  },
  onBuy: function(e) {
    console.log('onBuy: ', e)
  },
  onAdd: function () {
    var newVal = this.data.sliderValue + 1
    if (newVal > 100) { newVal = 100 }
    this.setData({ sliderValue: newVal })
  },
  onMinus: function () {
    var newVal = this.data.sliderValue - 1
    if (newVal < 1) { newVal = 1 }
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
    var actualPrice = roundPrice(selectedProduct.actualPrice)
    var discount = Math.round((selectedProduct.price0 - selectedProduct.actualPrice)*100 / selectedProduct.price0);
    this.setData({
      productName: selectedProduct.name,
      productPrice: selectedProduct.price0,
      productActualPrice: actualPrice,
      discount: discount
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