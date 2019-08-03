// comp/register-comp.js
const registerUtil = require('../utils/register-util.js');

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
    onRegister: function(e) {
      let that = this;
      wx.scanCode({
        success(res) {
          console.log('Scan result: ', res);
          let profileReq = registerUtil.parseJsonCustomer(res.result);
          console.log('Parsed result: ', profileReq);

          let newCustomer = {
            userid: 'c-',
            password: '123',
            password2: '123',
            userName: '张某',
            idCardNo: '310112197003113333',
            mobile: '13700033333',
            postAddr: '某省某市某区某路xx号 邮编111111'
          };

          that.prepareRegisterCustomer(newCustomer, profileReq);
        }
      })
    },

    onRegisterCustomerConfirm: function(e) {
      console.log('in onRegisterCustomerConfirm', e);
    },
    prepareRegisterCustomer: function (newCustomer, profileReq) {
      let registerCustomer = this.selectComponent('#registerCustomer');
      console.log('registerCustomer: ', registerCustomer);
      registerCustomer.initData(newCustomer, profileReq);
      registerCustomer.showDlg();
    }
  }
})
