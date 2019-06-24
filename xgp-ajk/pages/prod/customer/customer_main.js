// pages/prod/customer/customer_main.js
const util = require('../../../utils/util.js')

let roundPrice = function (price) {
  var p100 = Math.round(price * 100)
  return p100 / 100.0;
};

const customerProductUrl = util.customerBaseUrl + '/customerProductView'
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0
  },
  updateActiveTab: function (tabIndex) {
    this.setData({ activeTabIndex: tabIndex })
  },
  onTabbarChange: function (e) {
    console.log(e)
    wx.showToast({
      title: `切换到标签 ${e.detail}`,
      icon: 'none'
    });
    this.updateActiveTab(e.detail)
  },
  onSwiperChange: function (e) {
    console.log(e.detail.current)
    this.updateActiveTab(e.detail.current)
  },

  onBuy: function (e) {
    let prodId = e.target.dataset.id
    let prod = this.data.productDict[prodId]
    console.log('prod: ', prod)
    util.promisify(wx.getStorage)({ key: util.userTokenKey })
      .then(res => {
        let tokens = res.data
        console.log('got tokens: ', tokens)
        wx.request({
          url: wxPayUrl,
          data: {
            productId: prodId,
            info: prod.name,
            totalAmount: 1
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + tokens.accessToken,
            'X-Auth-Token': tokens.xauth
          },
          success: function (r2) {
            console.log('r2: ', r2)
            //util.saveTokens(r2.header[util.xAuthHeader], tokens.accessToken);
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
          },
          fail: function (e2) {
            console.info("e2: ", e2)
          }
        })
      })
  },

  updateProd: function (prodId, delta) {
    let prod = this.data.productDict[prodId]
    let productDict = this.data.productDict
    prod.count += delta
    prod.totalPrice = roundPrice(prod.actualPrice * prod.count)
    // console.log('prod: ', prodDict[prodId])
    let products = this.data.products
    products.forEach(function (item) { if (item === prodId) item.totalPrice = roundPrice(prod.count * item.actualPrice) })
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

  loadProds: function () {

  },
  onLoad: function (options) {
    let that = this
    util.promisify(wx.getStorage)({ key: util.userTokenKey })
      .then(res => {
        let tokens = res.data
        console.log('got tokens: ', tokens)

        wx.request({
          url: customerProductUrl,
          method: 'GET',
          header: {
            'Authorization': 'Bearer ' + tokens.accessToken,
            'X-Auth-Token': tokens.xauth
          },
          success: function (r1) {
            console.log('Customer product list:', r1);
            util.updateXAuth(r1.header[util.xAuthHeader]);

            let resDataRaw = r1.data
            var resData = resDataRaw.map(item => {
              let actualPrice = roundPrice(item.actualPrice);
              let price0 = roundPrice(item.product.price0)
              var hasDiscount = actualPrice < price0;
              var resDataItem = {
                id: item.product.id,
                imgUrl: `${util.imgBaseUrl}/${item.product.id}/${item.productAssets[0].url}`,
                name: item.product.name,
                price0: price0,
                actualPrice: actualPrice,
                hasDiscount: hasDiscount,
                referingProfName: item.referingProfName,
                count: 1,
                totalPrice: actualPrice
              }
              return resDataItem;
            })

            let productDict = {}
            console.log('resData.length: ', resData.length)
            for (var idx = 0; idx < resData.length; idx++) {
              //console.log('resData[idx]', resData[idx])
              let item = resData[idx]
              productDict[item.id] = item
            }

            that.setData({ products: resData, productDict: productDict })
          }
        })
      }).catch(function (reason) {
        console.log('failed:', reason);
      })

  },
  /**
   * Lifecycle function--Called when page load
   */

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