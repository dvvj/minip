// pages/mock/customer/product-list.js
const util = require('../../../utils/util.js');
const toastUtil = require('../../../utils/toast-util.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;
import Dialog from '../../../vant-lib/dialog/dialog';

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

  updateOrderList: function() {
    let that = this;
    this.setYearMonthRange = this.selectComponent("#setYearMonthRange");
    this.setYearMonthRange.setEnd(this.data.yearMonthEnd);
    this.setYearMonthRange.setStart(this.data.yearMonthStart);

    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.customer.getOrderList(
      this.data.yearMonthStart,
      this.data.yearMonthEnd,
      ordersRaw => {
        let orders = that.trimOrderData(ordersRaw)
        let orderList = that.selectComponent("#orderList");
        orderList.initData(orders);
        toastUtil.waiting(that, false);
      }
    );

  },

  updateSetting: function() {
    let that = this;
    let settingCustomer = this.selectComponent("#settingCustomer");
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.customer.getSetting(
      settingData => {
        console.log('[updateSettingTab]:', settingData);
        settingCustomer.initData(false, settingData);
        toastUtil.waiting(this, false);
      }
    );
  },

  updateProductList: function() {
    let that = this;
    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.customer.getProductList(
      (isMock, products) => {

        let productList = that.selectComponent('#productList');
        productList.initData(products);
        toastUtil.waiting(this, false);
      }
    );

  },
  onTabbarChange: function (e) {
    this.updateActiveTab(e.detail)
  },
  onSwiperChange: function (e) {
    console.log(e.detail.current)
    this.updateActiveTab(e.detail.current)
  },

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
      let quantity = order.order.quantity;
      let status = order.order.payTime ? '已付款' : '未付款';
      return { orderId, status, actualCost, quantity, creationTime, productShortName};
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