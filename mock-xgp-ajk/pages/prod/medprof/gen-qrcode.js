// pages/prod/medprof/gen-qrcode.js
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
    let qrcodeData = cacheUtil.retrieveStorage(util.currQrcodeDataKey, true);
    let medprofQrcodeGen = this.selectComponent('#medprofQrcodeGen');
    console.log('qrcodeData, medprofQrcodeGen:', qrcodeData, medprofQrcodeGen);
    medprofQrcodeGen.initData(qrcodeData);
  },

  onGoBack: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // let newQrcodes = prevPage.convertAndDraw(newlyAdded);
    // let qrcodes = this.data.qrcodes.concat(newQrcodes);
    // prevPage.updateQrcodeListAfterAdding();
    wx.navigateBack();
    // let newQrcodes = this.convertAndDraw(newlyAdded);
    // let qrcodes = this.data.qrcodes.concat(newQrcodes);
    // this.setData({ qrcodes });
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
    let medprofQrcodeGen = this.selectComponent('#medprofQrcodeGen');
    let newlyAdded = medprofQrcodeGen.getNewlyAdded();
    console.log('newlyAdded', newlyAdded);
    wx.setStorageSync(util.newlyAddedQrcodesKey, newlyAdded);
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