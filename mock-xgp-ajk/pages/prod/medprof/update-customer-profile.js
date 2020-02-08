// pages/prod/medprof/update-customer-profile.js
const util = require('../../../utils/util.js');
const cacheUtil = require('../../../utils/cache-util.js');
const toastUtil = require('../../../utils/toast-util.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;

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
    let { products, profile } = cacheUtil.getCurrCustomerProfile();
    let selected = products.filter(p => p.checked).map(p => p.shortName);
    console.log('selected: ', selected);
//    let pricePlanInfos = pricePlans.map(pp => pp.desc);
    //var prevSelectedIndex = 0;
    // for (var idx = 0; idx < pricePlans.length; idx++) {
    //   if (pricePlans[idx].id == selectedPlanId) {
    //     prevSelectedIndex = idx;
    //     break;
    //   }
    // }
    // let selectedPricePlan = pricePlans[prevSelectedIndex];
    // console.log("initially selected plan: ", selectedPricePlan);
    let customerId = profile.customerId;
    this.setData({ customerId, products, selected });
  },

  onSelectedProductChange: function(e) {
    console.log('event: ', e)
    this.setData({
      selected: e.detail
    });
  },
  // onPricePlanChange: function (e) {
  //   const { picker, value, index } = e.detail;
  //   let selectedPricePlan = this.data.pricePlans[index];
  //   console.log("price plan changed: ", selectedPricePlan);
  //   this.setData({ selectedPricePlan });
  // },

  getData: function () {
    let { customerId, products, selected } = this.data;
    console.log('products, selected', products, selected);
    let selectedProducts = products.filter(p => p.enabled && selected.includes(p.shortName));
    console.log('selectedProducts', selectedProducts);
    let selectedProductIds = selectedProducts.map(p => p.id);

    return {
      customerId,
      productIds: selectedProductIds
    };
  },

  onUpdateCustomerProfile: function(e) {
    let that = this;
    let reqData = this.getData();
    console.log('reqData: ', reqData);

    toastUtil.waiting(this, true, '加载数据中...');
    datasrc.medprof.updateCustomerProfile(
      reqData,
      respData => {
        console.log('updateCustomerProfile:', respData);
        toastUtil.waiting(that, false);

        let { success, msg } = respData;
        let message = success ? '添加成功' : `添加失败: ${msg}`
        success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
      }
    );
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