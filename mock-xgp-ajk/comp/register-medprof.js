// comp/register-medprof.js
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
    initData: function (newMedProfData, agentId) {
      let newMedProfByQR = this.selectComponent('#newMedProfByQR');
      newMedProfByQR.initData(newMedProfData, agentId);
    },

    showDlg: function () {
      let that = this;
      Dialog.alert({
        title: '新营养师注册',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '关闭',
        context: this
      }).then(() => {
        console.log('triggering confirm event: ');
        let newMedProfByQR = that.selectComponent('#newMedProfByQR');
        that.triggerEvent("confirm", newMedProfByQR.getUid());
        // on close
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})
