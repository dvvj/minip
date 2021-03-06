// comp/login-comp.js

const util = require('../utils/util.js')
const datasrc = require('../utils/' + util.datasrc).datasrc;
const toastUtil = require('../utils/toast-util.js');

const countDownMax = 100;

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
    password: '123',
    nextSmsTimer: null,
    nextSmsTimerCount: countDownMax
  },

  /**
   * Component methods
   */
  methods: {

    initData: function(userid, password) {
      this.setData({userid, password});
      this.clearTimer();
    },
    initTimer: function() {
      let that = this;
      let interval = setInterval(
        function () {
          let c = that.data.nextSmsTimerCount;
          if (c > 0) {
            console.log('timer: ', c);
            that.setData({ nextSmsTimerCount: c - 1 });
          }
          else {
            that.clearTimer();
          }
        }, 1000);
      this.setData({
        nextSmsTimer: interval,
        nextSmsTimerCount: countDownMax
      })
    },
    clearTimer: function() {
      console.log('clear timer: ', this.data);
      if (this.data.nextSmsTimer)
        clearInterval(this.data.nextSmsTimer);
      this.setData({ nextSmsTimer: null })
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
          else {
            this.clearTimer();
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
    onSmsCode: function(e) {
      let mobile = this.data.userid;
      if (!mobile) {
        console.log("手机号不能为空");
      }
      else if (mobile.length != 11) {
        console.log("手机号格式错误（当前仅支持大陆手机）");
      }
      else {
        let that = this;
        toastUtil.waiting(this, true, '获取短信中...');
        datasrc.getSmsLoginCode(mobile, resp => {
          toastUtil.waiting(that, false);
          let { success, msg } = resp;
          console.log("get sms code:", resp);
          if (!success) {
            toastUtil.fail(that, `获取短信失败: ${msg}`);
          }
          else {
            this.initTimer();
          }
        });
        //console.log("todo: get sms code");
      }
    }
  }
})
