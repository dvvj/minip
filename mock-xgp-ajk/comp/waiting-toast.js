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

  },

  /**
   * Component methods
   */
  methods: {
    show: function(msg) {
      Toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: msg,
        loadingType: 'spinner',
        context: this
      });
    },
    clear: function() {
      Toast.clear();
    }
  }
})
