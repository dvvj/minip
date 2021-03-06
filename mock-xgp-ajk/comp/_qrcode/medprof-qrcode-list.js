// comp/_qrcode/medprof-qrcode-list.js
const util = require('../../utils/util.js');
import drawQrcode from '../../utils/weapp.qrcode.min.js'
const toastUtil = require('../../utils/toast-util.js');
const datasrc = require('../../utils/' + util.datasrc).datasrc;
const cacheUtil = require('../../utils/cache-util.js');

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
    qrcodesEncoded: [],
    qrcodes: []
  },

  /**
   * Component methods
   */
  methods: {
    convertAndDraw: function (qrcodesEncoded) {
      let that = this;
      let qrcodesDecoded = qrcodesEncoded.map(enc => {
        let decArr = wx.base64ToArrayBuffer(enc.qrcodeEnc);
        enc.qrcode = util.base64DecAscii(decArr);
        //console.log('enc: ', enc);
        that.draw(enc);
        console.log('dec: ', enc.qrcode);
        return enc;
      });
      return qrcodesDecoded;
    },

    onSelectItem: function(e) {
      let idx = e.currentTarget.dataset.index;
      let qrcode = this.data.qrcodes[idx];
      console.log('selected: ', idx, qrcode);
      
      cacheUtil.saveSelectedQrcode(qrcode);
      wx.navigateTo({
        url: '../../../pages/prod/medprof/curr-qrcode',
      });
    },

    getEncodedQrcodes: function() {
      return this.data.qrcodesEncoded;
    },
    
    initData: function (qrcodesEncoded) {

      let qrcodes = this.convertAndDraw(qrcodesEncoded);
      let sysInfo = wx.getSystemInfoSync();
      let marginLeft = (sysInfo.windowWidth - 200) / 2 - 10;
      console.log('marginLeft: ', marginLeft);
      this.setData({ qrcodesEncoded, qrcodes, marginLeft });
    },
    onAddNewQRCodeClicked: function (e) {
      let that = this;
      let medprofQrcodeGen = this.selectComponent('#medprofQrcodeGen');
      console.log('todo: ', medprofQrcodeGen);

      toastUtil.waiting(this, true, '准备二维码数据中...');
      datasrc.medprof.getNewQrcodeData(
        qrcodeData => {
          //medprofQrcodeGen.initData(qrcodeData);
          wx.setStorageSync(util.currQrcodeDataKey, qrcodeData);
          toastUtil.waiting(that, false);
          wx.navigateTo({
            url: '../../../pages/prod/medprof/gen-qrcode',
          })
          //medprofQrcodeGen.showDlg();
        }
      );
    },

    draw: function (qr) {
      let that = this;
      let {id, qrcode} = qr;
      console.log('in draw ' + id);
      drawQrcode({
        width: 160,
        height: 160,
        x: 20,
        y: 20,
        //canvasId: 'qrc-canvas-' + id,
        ctx: wx.createCanvasContext('qrc-canvas-' + id, that),
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
  }
})
