// comp/register-customer.js
import Dialog from '../vant-lib/dialog/dialog';

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
    initData: function (newCustomer, profileReq) {
      let newCustomerInfo = this.selectComponent('#newCustomerInfo');
      newCustomerInfo.initData(newCustomer, profileReq);
    },

    showDlg: function() {
      let that = this;
      Dialog.alert({
        title: '新用户注册',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '完成',
        context: this
      }).then(() => {
        console.log('triggering confirm event: ');
        that.triggerEvent("confirm");
        // on close
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})
