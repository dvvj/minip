// comp/login-comp.js

const util = require('../utils/util.js')
const datasrc = require('../utils/' + util.datasrc).datasrc;
const sessionTestUrl = util.webappBase + '/sessionTest';
const toastUtil = require('../utils/toast-util.js');

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
    userid: 'p-prof',// 'c-o1a1p1c1', // , 'o-org'
    password: '123'
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(userid, password) {
      this.setData({userid, password});
    },
    onLogin: function (e) {
      let userid = this.data.userid;
      let password = this.data.password;
      console.log(`username: ${userid}, password: ${password}`);
      let that = this;

      // this.setInProgress(true);
      toastUtil.waiting(this, true, '登录中...');
      datasrc.login(
        userid, password,
        resp => {
          let { success, msg } = resp;
          console.log('resp: ', resp);
          toastUtil.waiting(that, false);

          if (!success) {
            toastUtil.fail(that, `登录失败: ${msg}`);
          }
          // this.setInProgress(false);
        }
      );
    },
    onInputUserId: function (e) {
      this.setData({ userid: e.detail })
    },
    onInputPassword: function (e) {
      this.setData({ password: e.detail })
    },

  }
})