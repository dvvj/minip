// pages/vant-test/vt2-layout.js
import Dialog from '../../vant-lib/dialog/dialog';
import Notify from '../../vant-lib/notify/notify';

Page({

  /**
   * Page initial data
   */
  data: {
    show: false
  },
  onClose:function(e) {
    this.setData({ show: false });
  },
  onClick: function (e) {
    this.setData({ show: true });
  },
  onDialog: function(e) {
    //this.setData({show:true})
    Dialog.alert({
      title: '标题',
      message: '弹窗内容'
    }).then(() => {
      // on close
    });
  },
  onNotify: function(e) {
    Notify('通知内容');
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