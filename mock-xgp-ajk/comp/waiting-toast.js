// comp/waiting-dialog.js
import Toast from '../vant-lib/toast/toast';

const Top = 'top';
const Center = 'center';
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
    _waiting: false
  },

  /**
   * Component methods
   */
  methods: {

    show4dlg: function (msg) {
      this.show0(msg, Center)
    },
    show: function (msg) {
      this.show0(msg, Top)
    },
    show0: function(msg, position) {
      let that = this;
      this.setData({ _waiting: true });
      setTimeout(
        function() {
          if (that.data._waiting) {
            Toast.loading({
              duration: 0,       // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              message: msg,
              position,
              loadingType: 'spinner',
              context: that
            });
          }
        },
        600
      );
    },
    clear: function() {
      this.setData({ _waiting: false });
      Toast.clear();
    },

    success: function(msg) {
      this.success0(msg, Top);
    },

    success4dlg: function (msg) {
      this.success0(msg, Center);
    },

    success0: function (msg, position) {
      this.setData({ _waiting: false });
      Toast.success({
        duration: 1000,
        message: msg,
        position,
        context: this
      });
    },

    fail: function (msg) {
      this.fail0(msg, Top);
    },
    fail4dlg: function (msg) {
      this.fail0(msg, Center);
    },
    fail0: function (msg, position) {
      this.setData({ _waiting: false });
      Toast.fail({
        duration: 5000,
        message: msg,
        position,
        context: this
      });
    }
  }
})
