// comp/waiting-dialog.js
import Toast from '../vant-lib/toast/toast';

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
    show: function(msg) {

      let that = this;
      this.setData({ _waiting: true });
      setTimeout(
        function() {
          if (that.data._waiting) {
            Toast.loading({
              duration: 0,       // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              message: msg,
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
      Toast.success({
        duration: 1000,
        message: msg,
        position: 'top',
        context: this
      });
    },

    fail: function (msg) {
      Toast.fail({
        duration: 2000,
        message: msg,
        position: 'top',
        context: this
      });
    }
  }
})
