// comp/_qrcode/qrcode-list.js
const util = require('../../utils/util.js');
const base64Util = require('../../utils/base64-codec.js');
import drawQrcode from '../../utils/weapp.qrcode.min.js'
const toastUtil = require('../../utils/toast-util.js');
const datasrc = require('../../utils/' + util.datasrc).datasrc;
const cacheUtil = require('../../utils/cache-util.js');
const registerUtil = require('../../utils/register-util.js');

const populateUserTypeDataMap = () => {
  var res = {};

  const userType = util.getUserType();
  res[registerUtil.userTypes.Customer] = {
    txt: '客户',
    color: '#22ccaa',
    newQrcodePrepDataFunc: 
      userType === 'MedProf' ? datasrc.medprof.getNewQrcodeData : datasrc.proforgagent.getNewQrcodeData,
    qrcodeGenPage: '../../../pages/prod/medprof/gen-qrcode'
  };
  res[registerUtil.userTypes.MedProf] = {
    txt: '营养师',
    color: '#2288ee',
    newQrcodePrepDataFunc: datasrc.proforgagent.getMedProfNewQrcodeData,
    qrcodeGenPage: '../../../pages/prod/orgagent/gen-qrcode'
  };
  res[registerUtil.userTypes.ProfOrgAgent] = {
    txt: '业务员',
    color: '#2222cc',
    newQrcodePrepDataFunc: datasrc.proforg.getNewProfOrgAgentData,
    qrcodeGenPage: '../../../pages/prod/proforg/gen-qrcode'
  };
  return res;
};
const userTypeDataMap = populateUserTypeDataMap();

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
        // let decArr = wx.base64ToArrayBuffer(enc.qrcodeEnc);
        // enc.qrcode = util.base64DecAscii(decArr);
        enc.qrcode = base64Util.baseDecode(enc.qrcodeEnc);
        //console.log('enc: ', enc);
        that.draw(enc);
        console.log('dec: ', enc.qrcode);
        let userType = registerUtil.parseUserType(enc.qrcode);
        enc.userTypeText = userTypeDataMap[userType];
        return enc;
      });
      return qrcodesDecoded;
    },

    onSelectItem: function (e) {
      let idx = e.currentTarget.dataset.index;
      let qrcode = this.data.qrcodes[idx];
      console.log('selected: ', idx, qrcode);

      cacheUtil.saveSelectedQrcode(qrcode);
      wx.navigateTo({
        url: '../../../pages/prod/medprof/curr-qrcode',
      });
    },

    getEncodedQrcodes: function () {
      return this.data.qrcodesEncoded;
    },

    initData: function (userType, qrcodesEncoded) {
      // console.log('initData: ', userTypeDataMap);
      let qrcodes = this.convertAndDraw(qrcodesEncoded);
      let sysInfo = wx.getSystemInfoSync();
      let marginLeft = (sysInfo.windowWidth - 200) / 2 - 10;
      console.log('qrcodes: ', qrcodes, userTypeDataMap);
      let userTypeText = userTypeDataMap[userType];
      this.setData({ qrcodesEncoded, qrcodes, marginLeft, userType, userTypeText });
    },
    onAddNewQRCodeClicked: function (e) {
      let that = this;
      // let qrcodeGen = this.selectComponent('#qrcodeGen');

      toastUtil.waiting(this, true, '准备二维码数据中...');
      let { newQrcodePrepDataFunc, qrcodeGenPage } = userTypeDataMap[this.data.userType];

      newQrcodePrepDataFunc(
        qrcodeData => {
          //medprofQrcodeGen.initData(qrcodeData);
          wx.setStorageSync(util.currQrcodeDataKey, qrcodeData);
          toastUtil.waiting(that, false);
          wx.navigateTo({
            url: qrcodeGenPage
          })
          //medprofQrcodeGen.showDlg();
        },
        util.getUserType()
      );
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
