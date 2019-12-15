// comp/register-customer.js
import Dialog from '../../../vant-lib/dialog/dialog';

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
    initData: function (profId, newCustomer, profileReq) {
      let newCustomerInfo = this.selectComponent('#newCustomerInfo');
      newCustomerInfo.initData(profId, newCustomer, profileReq);
    },

    showDlg: function() {
      let that = this;
      Dialog.alert({
        title: '新用户注册',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '关闭',
        context: this
      }).then(() => {
        console.log('triggering confirm event: ');
        let newCustomerInfo = that.selectComponent('#newCustomerInfo');
        that.triggerEvent("confirm", newCustomerInfo.getUidOrMobile());
        // on close
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})
