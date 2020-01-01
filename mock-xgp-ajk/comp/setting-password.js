// comp/setting-password.js
const util = require('../utils/util.js');
const inputCheck = require('../utils/input-check.js');

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
    altUids: [],
    userPassInfo: { },
    errorMsgs: {
      passwordCannotBeEmpty: '密码不能为空',
      passwordsNotMatch: '两次输入密码不匹配',
      mobileCannotBeEmpty: '手机号不能为空',
      mobileFormatError: '手机号格式不正确'
    },
    errors: {
      password: '',
      password2: '',
      mobile: ''
    }
  },

  /**
   * Component methods
   */
  methods: {
    getSwitchUserComp: function() {
      return this.selectComponent("#switchUser");
    },
    initData: function (userPassInfo) {
      let altUids = util.getAltUids();

      console.log('initData: ', userPassInfo, altUids);
      altUids = altUids.filter(uid => userPassInfo.userid !== uid);
      console.log('initData after filtering: ', altUids);

      this.setData({ userPassInfo, altUids });
      const su = this.getSwitchUserComp();
      if (altUids.length > 0) {
        su.initData(altUids);
      }
    },

    updateUserPassInfo: function (field, e) {
      var t = this.data.userPassInfo;
      t[field] = e.detail;
      this.setData({ userPassInfo: t });
      this.updateAllErrors();
    },
    updateError: function (field, errorMsg) {
      var t = this.data.errors;
      t[field] = errorMsg;
      console.log('dddddd', t);
      this.setData({ errors: t });
    },
    checkPasswordMatch: function () {
      return this.data.userPassInfo.password === this.data.userPassInfo.password2;
    },
    updateAllErrors: function () {
      this.updateError(
        'password2',
        this.checkPasswordMatch() ? '' : this.data.errorMsgs.passwordsNotMatch
      );
      this.updateError(
        'password',
        this.data.userPassInfo.password ? '' : this.data.errorMsgs.passwordCannotBeEmpty
      );
      this.updateError(
        'mobile',
        inputCheck.mobile.check(this.data.userPassInfo.mobile)
      );
    },
    onInputPassword: function (e) {
      this.updateUserPassInfo("password", e);
    },
    onInputPassword2: function (e) {
      this.updateUserPassInfo("password2", e);
    },
    onInputMobile: function (e) {
      this.updateUserPassInfo("mobile", e);
    },

    onUpdateSetting: function (e) {
      let that = this;
      console.log('[onUpdateSetting]: ', this.data.userPassInfo);
      toastUtil.waiting(that, true, '更新中...');
      datasrc.updateSetting(
        this.data.userPassInfo,
        resp => {
          let { success, msg } = resp;
          console.log(resp);
          toastUtil.waiting(this, false);
          success ? toastUtil.success(that, '更新成功') : toastUtil.fail(that, msg);
        }
      )
    },

    onSwitchUser: function(e) {
      const su = this.getSwitchUserComp();
      su.show();
    }
  }
})
