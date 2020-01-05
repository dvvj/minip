// comp/register-comp.js
const registerUtil = require('../utils/register-util.js');
const base64Util = require('../utils/base64-codec.js');

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
          // let dec1 = base64Util.baseDecode(res.rawData);
          // console.log('dec1: ', dec1, base64Util.baseDecode(base64Util.baseEncode("中文测试")));
          let json = res.result;
          let userType = registerUtil.parseUserType(json);

          if (userType === registerUtil.userTypes.Customer) {
            that.registerCustomer(json);
          }
          else if (userType === registerUtil.userTypes.MedProf) {
            that.registerMedProf(json);
          }
          else if (userType === registerUtil.userTypes.ProfOrgAgent) {
            that.registerProfOrgAgent(json);
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
    registerProfOrgAgent: function (qrJson) {
      let parsed = registerUtil.parseJsonProfOrgAgent(qrJson);
      console.log('Parsed result: ', parsed);
      this.prepareProfOrgAgent(parsed);
    },
    prepareProfOrgAgent: function (qrcodeData) {
      let registerProfOrgAgent = this.selectComponent('#registerProfOrgAgent');

      const orgId = qrcodeData.orgId;
      console.log('prepareProfOrgAgent: ', orgId);

      let newProfOrgAgent = {
        // name: '张某',
        // mobile: '13700033333'
      };

      let newMedProfData = { newProfOrgAgent, ...qrcodeData };

      registerProfOrgAgent.initData(newMedProfData, orgId);
      registerProfOrgAgent.showDlg();
    },

    prepareMedProf: function (qrcodeData) {
      let registerMedProf = this.selectComponent('#registerMedProf');
      //console.log('registerMedProf: ', registerMedProf);

      let newMedProf = {
        // // profid: 'p-',
        // // password: '123',
        // // password2: '123',
        // name: '张某',
        // mobile: '13700044444'
        // // info: '脑,心血管'
      };

      let newMedProfData = { newMedProf, ...qrcodeData };

      registerMedProf.initData(newMedProfData, qrcodeData.agentId);
      registerMedProf.showDlg();
    },

    registerMedProf: function (qrJson) {
      let parsed = registerUtil.parseJsonMedProf(qrJson);
      console.log('Parsed result: ', parsed);
      this.prepareMedProf(parsed);
    },

    registerCustomer_prefilled: function(qrJson) {
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
    
    registerCustomer: function (qrJson) {
      let parsed = registerUtil.parseJsonCustomer(qrJson);
      console.log('Parsed result: ', parsed);
      let { userType, profileReq } = parsed;
      let profId = parsed.uid;

      let newCustomer = {};

      this.prepareRegisterCustomer(profId, newCustomer, profileReq);
    },

    postRegistration: function(uid) {
      console.log('in postRegistration, uid: ', uid);
      this.triggerEvent("postRegistration", uid);
    },

    onRegisterCustomerConfirm: function(e) {
      let uid = e.detail;
      console.log('in onRegisterCustomerConfirm, uid: ', uid, e);
      this.postRegistration(uid);
    },

    onRegisterMedProfConfirm: function(e) {
      let uid = e.detail;
      console.log('in onRegisterMedProfConfirm, uid: ', uid, e);
      this.postRegistration(uid);
    },

    onRegisterProfOrgAgentConfirm: function (e) {
      let uid = e.detail;
      console.log('in onRegisterProfOrgAgentConfirm, uid: ', uid, e);
      this.postRegistration(uid);
    },

    prepareRegisterCustomer: function (profId, newCustomer, profileReq) {
      let registerCustomer = this.selectComponent('#registerCustomer');
      console.log('registerCustomer: ', registerCustomer);
      registerCustomer.initData(profId, newCustomer, profileReq);
      registerCustomer.showDlg();
    }
  }
})
