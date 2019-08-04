// comp/_qrcode/medprof-qrcode-gen.js
import Dialog from '../../vant-lib/dialog/dialog';
const util = require('../../utils/util.js');
const registerUtil = require('../../utils/register-util.js');

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
    showDlg: function() {
      let that = this;
      Dialog.alert({
        title: '生成新二维码',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '关闭',
        context: this
      }).then(() => {
        console.log('triggering confirm event: ');
        that.triggerEvent("confirm");
        // on close
      }).catch(reason => console.log('cancelled: ', reason));

    },
    onNewQRCode: function() {
      let selectedProducts = this.data.products
        .filter(p => p.checked && this.data.selected.includes(p.shortName));
      let selectedProductIds = selectedProducts.map(prod => prod.id);
      let prodsDesc = selectedProducts.map(prod => prod.shortName).join(',');

      let profId = util.getUserId();
      let pricePlan = this.data.selectedPricePlan;
      let pricePlanId = pricePlan.id;
      let qrcodeDesc = `【${prodsDesc}】,${pricePlan.desc}`;
      let newQrcode = registerUtil.genQRStrCustomer(selectedProductIds, profId, pricePlanId);
      let newQrCodeReq = {
        profId,
        qrcode: newQrcode,
        qrcodeDesc
      }
      console.log('onNewQRCode:', newQrCodeReq);
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
  }
})
