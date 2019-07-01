// pages/tmp/year-month-range-test.js
import Dialog from '../../vant-lib/dialog/dialog';

Page({

  /**
   * Page initial data
   */
  data: {
    // endDate: new Date(),
    // startDate: new Date(2018, 11, 1)
  },

  onDlgConfirm: function(e) {
    console.log('dlg confirm: ', this.yearMonth.getSelection())
  },
  showYearMonthPicker: function (e) {
    Dialog.alert({
      title: '设置起止年月',
      showConfirmButton: true,
      showCancelButton: true
    }).then(() => {
      // on close
    }).catch(reason => console.log('cancelled: ', reason));
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    this.yearMonth = this.selectComponent("#yearMonthRange");
    console.log('onReady: ', this.yearMonth);
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