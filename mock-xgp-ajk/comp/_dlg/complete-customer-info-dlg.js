// comp/_dlg/complete-customer-info-dlg.js
import Dialog from '../../vant-lib/dialog/dialog';

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

  },

  /**
   * Component methods
   */
  methods: {
    initData: function (currCustomer) {
      let completeCustomerInfo = this.selectComponent('#completeCustomerInfo');
      completeCustomerInfo.initData(currCustomer);
    },

    showDlg: function () {
      let that = this;
      Dialog.alert({
        title: '完善用户资料',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '关闭',
        context: this
      }).then(() => {
        console.log('done 完善用户资料: ');
        // let completeCustomerInfo = that.selectComponent('#completeCustomerInfo');
        // that.triggerEvent("confirm", newCustomerInfo.getUidOrMobile());
        // on close
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})
