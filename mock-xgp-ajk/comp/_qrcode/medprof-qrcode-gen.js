// comp/_qrcode/medprof-qrcode-gen.js
// import Dialog from '../../vant-lib/dialog/dialog';
const util = require('../../utils/util.js');
const registerUtil = require('../../utils/register-util.js');
const toastUtil = require('../../utils/toast-util.js');
const datasrc = require('../../utils/' + util.datasrc).datasrc;

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
    products: [],
    selected: [],
    pricePlans: [],
    pricePlanInfos: [],
    selectedPricePlan: {},
    errorMsgs: {},
    newlyAdded: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newQrcodeData) {
      console.log('newQrcodeData', newQrcodeData);
      let { products, pricePlans } = newQrcodeData;
      let selected = products.filter(p => p.checked).map(p => p.shortName);
      let pricePlanInfos = pricePlans.map(pp => pp.desc);
      let selectedPricePlan = pricePlans[0];
      this.setData({
        products,
        selected,
        pricePlans,
        pricePlanInfos,
        selectedPricePlan
      });
    },
    // showDlg: function() {
    //   let that = this;
    //   this.setData({ newlyAdded: [] });
    //   Dialog.alert({
    //     title: '生成新二维码',
    //     showConfirmButton: true,
    //     showCancelButton: false,
    //     confirmButtonText: '关闭',
    //     context: this
    //   }).then(() => {
    //     console.log('triggering close event: ');
    //     that.triggerEvent("close");
    //     // on close
    //   }).catch(reason => console.log('cancelled: ', reason));

    // },
    getNewlyAdded: function() {
      return this.data.newlyAdded;
    },

    onNewQRCode: function() {
      let that = this;
      let selectedProducts = this.data.products
        .filter(p => p.checked && this.data.selected.includes(p.shortName));
      let selectedProductIds = selectedProducts.map(prod => prod.id);
      let prodsDesc = selectedProducts.map(prod => prod.shortName).join(',');

      let uid = util.getUserId();
      let pricePlan = this.data.selectedPricePlan;
      let pricePlanId = pricePlan.id;
      let qrcodeDesc = `【${prodsDesc}】,${pricePlan.desc}`;
      let newQrcode = registerUtil.genQRStrCustomer(selectedProductIds, uid, pricePlanId);
      let newQrCodeReq = {
        uid,
        userType: 'c',
        qrcode: newQrcode,
        qrcodeDesc
      };
      console.log('onNewQRCode:', newQrCodeReq);
      
      let { userType } = util.getStoredTokens();
      var datasrcFunc = null;
      if (userType == 'MedProf') {
        datasrcFunc = datasrc.medprof.saveNewQrcode;
      } else if (userType == 'ProfOrgAgent') {
        datasrcFunc = datasrc.proforgagent.saveNewQrcode;
      }
      else {
        console.log('invalid user type: ', userType);
      }
      toastUtil.waiting(this, true, '保存二维码...');
      datasrcFunc(
        newQrCodeReq,
        respData => {
          console.log('saveNewQrcode', respData);
          let { success, dataOrMsg } = respData;
          let message = success ? '保存成功' : `保存失败: ${dataOrMsg}`;
          if (success) {
            let newlyAdded = this.data.newlyAdded;
            newlyAdded.push(dataOrMsg);
            that.setData({newlyAdded});
          }
          success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
        }
      );
    },
    onPricePlanChange: function (e) {
      const { picker, value, index } = e.detail;
      let selectedPricePlan = this.data.pricePlans[index];
      console.log("price plan changed: ", selectedPricePlan);
      this.setData({ selectedPricePlan });
    },
    onProductCheckboxChange(e) {
      console.log('event: ', e)

      this.setData({
        selected: e.detail
      });
    },

    onGoBack: function(e) {
      this.triggerEvent("goback");
    }
  }
})
