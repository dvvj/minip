// comp/_registration/_proforgagent/register-proforgagent.js
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
    initData: function (newProfOrgAgentData, orgId) {
      let newProfOrgAgentByQR = this.selectComponent('#newProfOrgAgentByQR');
      newProfOrgAgentByQR.initData(newProfOrgAgentData, orgId);
    },

    showDlg: function () {
      let that = this;
      Dialog.alert({
        title: '新业务员注册',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '关闭',
        context: this
      }).then(() => {
        console.log('triggering confirm event: ');
        let newProfOrgAgentByQR = that.selectComponent('#newProfOrgAgentByQR');
        that.triggerEvent("confirm", newProfOrgAgentByQR.getUidOrMobile());
        // on close
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})