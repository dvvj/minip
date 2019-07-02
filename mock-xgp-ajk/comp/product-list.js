// comp/product-list.js
const util = require('../utils/util.js')

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    products: [],
    productDict: {}
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(products, productDict) {
      // console.log("products: ", products);
      this.setData({ products, productDict});
    },

    updateProd: function (prodId, delta) {
      let prod = this.data.productDict[prodId]
      let productDict = this.data.productDict
      prod.count += delta
      prod.totalPrice = util.roundPrice(prod.actualPrice * prod.count)
      // console.log('prod: ', prodDict[prodId])
      let products = this.data.products
      products.forEach(function (item) { if (item === prodId) item.totalPrice = util.roundPrice(prod.count * item.actualPrice) })
      this.setData({ productDict, products })
    },

    onPlus: function (e) {
      console.log(e)
      let prodId = e.target.dataset.id
      this.updateProd(prodId, 1)
    },

    onMinus: function (e) {
      console.log(e)
      let prodId = e.target.dataset.id
      this.updateProd(prodId, -1)
    },

    onBuy: function(e) {
      console.log("[todo] onBuy");
    }
  }
})
