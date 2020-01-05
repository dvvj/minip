// pages/prod/medprof/curr-qrcode.js
const util = require('../../../utils/util.js');
const base64Util = require('../../../utils/base64-codec.js');
import drawQrcode from '../../../utils/weapp.qrcode.min.js'
const cacheUtil = require('../../../utils/cache-util.js');

Page({

  /**
   * Page initial data
   */
  data: {
    qrcode: {}
  },

  convertAndDraw: function (qrcode) {
    // let decArr = wx.base64ToArrayBuffer(qrcode.qrcodeEnc);
    // qrcode.qrcode = util.base64DecAscii(decArr);
    qrcode.qrcode = base64Util.baseDecode(enc.qrcodeEnc);
    this.draw(qrcode);
    console.log('decoded: ', qrcode.qrcode);
  },

  draw: function (qr) {
    let that = this;
    let { id, qrcode } = qr;
    console.log('in draw ' + id);
    drawQrcode({
      width: 160,
      height: 160,
      x: 20,
      y: 20,
      //canvasId: 'qrc-canvas-' + id,
      ctx: wx.createCanvasContext('qrc-canvas', that),
      typeNumber: 10,
      text: qrcode,
      image: {
        //imageResource: '../../images/icon.png',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      },
      callback(e) {
        console.log('e: ', e)
      }
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let qrcode = cacheUtil.getSelectedQrcode();
    this.convertAndDraw(qrcode);
    let sysInfo = wx.getSystemInfoSync();
    let marginLeft = (sysInfo.windowWidth - 200) / 2 - 20;
    console.log('marginLeft: ', marginLeft);

    this.setData({ qrcode, marginLeft });
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