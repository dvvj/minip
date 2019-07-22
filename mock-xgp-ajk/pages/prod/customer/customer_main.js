// pages/mock/customer/product-list.js
const util = require('../../../utils/util.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;
import Dialog from '../../../vant-lib/dialog/dialog';

let roundPrice = function (price) {
  var p100 = Math.round(price * 100)
  return p100 / 100.0;
};

const customerProductUrl = util.webappBase + '/customerProductView'
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

const tabIndices = {
  productList: 0,
  orderList: 1,
  settingCustomer: 2
};

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,
    orderList: []
  },

  onConfirmYearMonthRange: function(e) {
    console.log('in onConfirmYearMonthRange', e);
    let setYearMonthRange = this.selectComponent("#setYearMonthRange");
    let range = setYearMonthRange.getSelection();
    console.log('range: ', range);
    this.yearMonthRange(range.start, range.end);
    this.updateOrderList();
  },
  updateActiveTab: function(tabIndex) {
    this.setData({ activeTabIndex: tabIndex });
    this.updateTabContent(tabIndex);
  },

  updateTabContent: function(tabIndex) {
    if (tabIndex == tabIndices.productList) {
      this.updateProductList();
    }
    else if (tabIndex == tabIndices.orderList) {
      this.updateOrderList();
    }
    else if (tabIndex == tabIndices.settingCustomer) {
      this.updateSetting();
    }
    
  },

  showWaitingToast: function (doShow, msg) {
    let waitingToast = this.selectComponent('#waitingToast');
    doShow ? waitingToast.show(msg) : waitingToast.clear();
  },

  updateOrderList: function() {
    let that = this;
    this.setYearMonthRange = this.selectComponent("#setYearMonthRange");
    this.setYearMonthRange.setEnd(this.data.yearMonthEnd);
    this.setYearMonthRange.setStart(this.data.yearMonthStart);

    this.showWaitingToast(true, '加载数据中...');
    datasrc.customer.getOrderList(
      this.data.yearMonthStart,
      this.data.yearMonthEnd,
      ordersRaw => {
        let orders = this.trimOrderData(ordersRaw)
        let orderList = this.selectComponent("#orderList");
        orderList.initData(orders);
        that.showWaitingToast(false);
      }
    );

  },

  updateSetting: function() {
    let that = this;
    let settingCustomer = this.selectComponent("#settingCustomer");
    this.showWaitingToast(true, '加载数据中...');
    datasrc.customer.getSetting(
      settingData => {
        console.log('[updateSettingTab]:', settingData);
        settingCustomer.initData(false, settingData);
        that.showWaitingToast(false);
      }
    );
  },

  updateProductList: function() {
    let that = this;
    this.showWaitingToast(true, '加载数据中...');
    datasrc.customer.getProductList(
      (isMock, resDataRaw) => {
        var products = resDataRaw.map(item => {
          let actualPrice = roundPrice(item.actualPrice);
          let price0 = roundPrice(item.product.price0)
          var hasDiscount = actualPrice < price0;
          var resDataItem = {
            id: item.product.id,
            imgUrl: isMock ? '/images/product1.png' : `${util.imgBaseUrl}/${item.product.id}/${item.productAssets[0].url}`, //, //item.productAssets[0].url,
            name: item.product.name,
            price0: price0,
            actualPrice: actualPrice,
            hasDiscount: hasDiscount,
            referingProfName: item.referingProfName,
            count: 1,
            totalPrice: actualPrice
          }
          that.showWaitingToast(false);
          return resDataItem;
        })

        let productDict = {}
        console.log('products.length: ', products.length)
        for (var idx = 0; idx < products.length; idx++) {
          let item = products[idx]
          productDict[item.id] = item
        }

        let productList = that.selectComponent('#productList');
        productList.initData(products, productDict);
      }
    );

  },
  onTabbarChange: function (e) {
    // console.log(e)
    // wx.showToast({
    //   title: `切换到标签 ${e.detail}`,
    //   icon: 'none'
    // });
    this.updateActiveTab(e.detail)
  },
  onSwiperChange: function (e) {
    console.log(e.detail.current)
    this.updateActiveTab(e.detail.current)
  },
  // onBuy: function (e) {
  //   let prodId = e.target.dataset.id
  //   let prod = this.data.productDict[prodId]
  //   console.log('prod: ', prod);
  //   let tokens = 
  //   util.promisify(wx.getStorage)({ key: "tokens" })
  //     .then(res => {
  //       let tokens = res.data
  //       console.log('got tokens: ', tokens)
  //       wx.request({
  //         url: wxPayUrl,
  //         data: {
  //           productId: prodId,
  //           info: prod.name,
  //           totalAmount: 1
  //         },
  //         method: "POST",
  //         header: {
  //           'content-type': 'application/json',
  //           'Authorization': 'Bearer ' + tokens.accessToken,
  //           'X-Auth-Token': tokens.xauth
  //         },
  //         success: function (r2) {
  //           console.log('r2: ', r2)
  //           util.saveTokens(r2.header[util.xAuthHeader], tokens.accessToken);
  //           wx.requestPayment({
  //             'timeStamp': r2.data.timeStamp,
  //             'nonceStr': r2.data.nonceStr,
  //             'package': r2.data.package_,
  //             'signType': 'MD5',
  //             'paySign': r2.data.paySign,
  //             success: function (r3) {
  //               console.info('r3: ', r3)
  //               //报名
  //               //goApply(event, that)
  //             },
  //             fail: function (e3) {
  //               console.info("e3: ", e3)
  //             },
  //             complete: function (c3) {
  //               console.info("c3: ", c3)
  //             }
  //           })
  //         },
  //         fail: function (e2) {
  //           console.info("e2: ", e2)
  //         }
  //       })
  //     })
  // },

  yearMonthRange: function(startYM, endYM) {
    let yearMonthStart = `${startYM.year}-${startYM.month}`;
    let yearMonthEnd = `${endYM.year}-${endYM.month}`;
    console.log('yearMonthStart:', yearMonthStart);
    this.setData({
      yearMonthStart,
      yearMonthEnd
    });
  },
  setYearMonthDefault: function() {
    let { _startYM, _endYM } = util.getYearMonthDefault();
    this.yearMonthRange(_startYM, _endYM);
    // let yearMonthStart = `${_startYM.year}-${_startYM.month}`;
    // let yearMonthEnd = `${_endYM.year}-${_endYM.month}`;
    // console.log('yearMonthStart:', yearMonthStart);
    // this.setData({
    //   // orderListStart: _startYM,
    //   // orderListEnd: _endYM,
    //   yearMonthStart,
    //   yearMonthEnd
    // });
  },
  onLoad: function (options) {
    this.setYearMonthDefault();
    this.updateActiveTab(this.data.activeTabIndex);
  },

  trimOrderData: function(orders) {
    return orders.map(order => {
      let actualCost = order.order.actualCost;
      let productShortName = order.productShortName;
      let creationTime = order.order.creationTime
        .substring(0, 16)
        .replace('T', ' ');
      let orderId = order.order.id;
      let prodCount = order.order.qty;
      let status = order.order.payTime ? '已付款' : '未付款';
      return { orderId, status, actualCost, prodCount, creationTime, productShortName};
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