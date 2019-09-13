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
          let json = res.result;
          let userType = registerUtil.parseUserType(json);

          if (userType === registerUtil.userTypes.Customer) {
            that.registerCustomer(json);
          }
          else if (userType === registerUtil.userTypes.MedProf) {
            that.registerMedProf(json);
          }
          // let parsed = registerUtil.parseJsonCustomer(res.result);
          // console.log('Parsed result: ', parsed);
          // let { userType, profId, profileReq } = parsed;

          // // todo: based on userType

          // let newCustomer = {
          //   userid: 'c-',
          //   password: '123',
          //   password2: '123',
          //   userName: '张某',
          //   idCardNo: '310112197003113333',
          //   mobile: '13700033333',
          //   postAddr: '某省某市某区某路xx号 邮编111111'
          // };

          // that.prepareRegisterCustomer(profId, newCustomer, profileReq);
        }
      })
    },

    prepareMedProf: function (qrcodeData) {
      let registerMedProf = this.selectComponent('#registerMedProf');
      console.log('registerMedProf: ', registerMedProf);

      let newMedProf = {
        profid: 'p-',
        password: '123',
        password2: '123',
        name: '张某',
        mobile: '13700044444',
        info: '脑,心血管'
      };

      let newMedProfData = { newMedProf, rewardPlanId: qrcodeData.rewardPlanId };

      registerMedProf.initData(newMedProfData);
      registerMedProf.showDlg();
    },
    registerMedProf: function (qrJson) {
      let parsed = registerUtil.parseJsonMedProf(qrJson);
      console.log('Parsed result: ', parsed);
      this.prepareMedProf(parsed);
    },

    registerCustomer: function(qrJson) {
      let parsed = registerUtil.parseJsonCustomer(qrJson);
      console.log('Parsed result: ', parsed);
      let { userType, profileReq } = parsed;
      let profId = parsed.uid;

      // todo: based on userType

      let newCustomer = {
        userid: 'c-',
        password: '123',
        password2: '123',
        userName: '张某',
        idCardNo: '310112197003113333',
        mobile: '13700033333',
        postAddr: '某省某市某区某路xx号 邮编111111'
      };

      this.prepareRegisterCustomer(profId, newCustomer, profileReq);
    },

    onRegisterCustomerConfirm: function(e) {
      console.log('in onRegisterCustomerConfirm', e);
    },

    onRegisterMedProfConfirm: function(e) {
      console.log('in onRegisterMedProfConfirm', e);
    },

    prepareRegisterCustomer: function (profId, newCustomer, profileReq) {
      let registerCustomer = this.selectComponent('#registerCustomer');
      console.log('registerCustomer: ', registerCustomer);
      registerCustomer.initData(profId, newCustomer, profileReq);
      registerCustomer.showDlg();
    }
  }
})
