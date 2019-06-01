var temp = {
  onTap: function (event) {
    //console.log("点击了", event.currentTarget)
    var itemKey = event.currentTarget.dataset.item

    if (itemKey) {
      //console.log("itemKey: ", itemKey)
      var productDict = wx.getStorageSync('productDict')

      var selectedProduct = productDict[itemKey]
      console.log("selectedProduct: ", selectedProduct)
      var selectedProductKey = 'selectedProduct'
      wx.setStorageSync(selectedProductKey, selectedProduct)
      wx.navigateTo({
        url: '../product_detail/product_detail',
      })
    }
    else {
      console.log("itemKey not defined")
    }
  }
}

export default temp