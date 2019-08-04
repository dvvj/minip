// comp/_qrcode/medprof-qrcode-list.js
const util = require('../../utils/util.js');
import drawQrcode from '../../utils/weapp.qrcode.min.js'

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
    qrcodes: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (qrcodesEncoded) {
      let that = this;
      let qrcodes = qrcodesEncoded.map(enc => {
        let decArr = wx.base64ToArrayBuffer(enc.qrcodeEnc);
        enc.qrcode = util.base64DecAscii(decArr);
        console.log('enc: ', enc);
        that.draw(enc);
        console.log('dec: ', enc.qrcode);
        return enc;
      });
      let sysInfo = wx.getSystemInfoSync();
      let marginLeft = (sysInfo.windowWidth - 200) / 2 - 10;
      console.log('marginLeft: ', marginLeft);
      this.setData({ qrcodes, marginLeft });
    },
    onAddNewQRCodeClicked: function (e) {
      console.log('todo');
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
