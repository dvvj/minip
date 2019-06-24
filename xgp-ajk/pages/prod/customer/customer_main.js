// pages/prod/customer/customer_main.js
const util = require('../../../utils/util.js')
import Dialog from '../../../vant-lib/dialog/dialog';

let roundPrice = function (price) {
  var p100 = Math.round(price * 100)
  return p100 / 100.0;
};

const customerProductUrl = util.customerBaseUrl + '/customerProductView';
const orderListUrl = util.customerBaseUrl + '/ordersBtw';
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,
    orderList: {
      start: { year: 2018, month: 11 },
      end: { year: 2019, month: 3 },
      orders: []
    },
    yearMonthPicker: {
      activeTabIndex: 0,
      start: { year: 2018, month: 11 },
      end: { year: 2019, month: 3 },
      current: new Date().getTime()
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },

  onMonthPickerChangeTab: function (e) {
    let newIndex = e.detail.index;
    let t = {
      ...this.data.yearMonthPicker,
      activeTabIndex: newIndex
    };
    this.setData({ yearMonthPicker: t })
  },
  onMonthPickerConfirm: function (e) {
    console.log('onMonthPickerConfirm', e)
    let date = new Date(e.detail)
    let t = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
    let res = { year: t.year, month: t.month }

    let t2 = {
      ...this.data.yearMonthPicker,
    };
    if (this.data.yearMonthPicker.activeTabIndex == 0) {
      let start = res;
      t2['start'] = start;
    }
    else {
      let end = res;
      t2['end'] = res;
    }
    this.setData({ yearMonthPicker: t2 });
  },
  onMonthPickerCancel: function (e) {
    Dialog.close();
  },
  onSetYearMonth: function (e) {
    this.showDialog('设置起止年月', 'start')
  },
  onYMDlgConfirm: function (e) {
    console.log('confirmed: ', this.data.yearMonthPicker);
    let t = {
      ...this.data.orderList,
      start: this.data.yearMonthPicker.start,
      end: this.data.yearMonthPicker.end
    };
    this.setData({ orderList: t })
  },
  showDialog: function (title, dlgType) {
    this.setData({ dlgType: dlgType });
    Dialog.alert({
      title: title,
      showConfirmButton: true,
      showCancelButton: true
    }).then(() => {
      // on close
    }).catch(reason => console.log('cancelled: ', reason));
  },

  updateActiveTab: function (tabIndex) {
    this.updateContent(tabIndex);
    this.setData({ activeTabIndex: tabIndex });
  },
  updateContent: function (tabIndex) {
    if (tabIndex == 1) {
      this.updateOrderList();
    }
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
          header: util.postJsonReqHeader(tokens),
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

  updateOrderList: function() {
    let startYearMonth = `${this.data.orderList.start.year}-${this.data.orderList.start.month}`;
    let endYearMonth = `${this.data.orderList.end.year}-${this.data.orderList.end.month}`;
    let that = this;
    util.promisify(wx.getStorage)({ key: util.userTokenKey })
      .then(res => {
        let tokens = res.data
        console.log('[updateOrderList] got tokens: ', tokens)
        wx.request({
          url: orderListUrl,
          data: { startYearMonth, endYearMonth },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
          success: function (orderListReqRes) {
            console.log('orderListReqRes: ', orderListReqRes)
            let ordersRaw = orderListReqRes.data;
            let orderData = {
              ...that.data.orderList,
              orders: that.trimOrderData(ordersRaw)
            }
            that.setData({ orderList: orderData })
          },
          fail: function (e2) {
            console.info("e2: ", e2)
          }
        })
      })
  },
  trimOrderData: function (orders) {
    return orders.map(order => {
      let actualCost = order.order.actualCost;
      let productShortName = order.productShortName;
      let creationTime = order.order.creationTime
        .substring(0, 16)
        .replace('T', ' ');
      return { actualCost, creationTime, productShortName };
    })
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
        console.log('[GetProducts] got tokens: ', tokens)

        wx.request({
          url: customerProductUrl,
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
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