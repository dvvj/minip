// comp/register-proforgagent.js
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
    initData: function (newProfOrgAgentData) {
      let newProfOrgAgentByQR = this.selectComponent('#newProfOrgAgentByQR');
      newProfOrgAgentByQR.initData(newProfOrgAgentData);
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
        that.triggerEvent("confirm");
        // on close
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})
