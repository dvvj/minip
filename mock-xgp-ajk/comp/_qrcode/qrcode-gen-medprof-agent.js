// comp/_qrcode/medprof-qrcode-gen.js
// import Dialog from '../../vant-lib/dialog/dialog';
const util = require('../../utils/util.js');
const registerUtil = require('../../utils/register-util.js');
const toastUtil = require('../../utils/toast-util.js');
const datasrc = require('../../utils/' + util.datasrc).datasrc;

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
    userType: null,
    rewardPlans: [],
    rewardPlanInfos: [],
    selectedRewardPlan: {},
    errorMsgs: {},
    newlyAdded: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newQrcodeData) {
      console.log('newQrcodeData for medprof/agent', newQrcodeData);
      let { userType, rewardPlans } = newQrcodeData;
      let rewardPlanInfos = rewardPlans.map(pp => pp.info);
      let selectedRewardPlan = rewardPlans[0];
      this.setData({
        userType,
        rewardPlans,
        rewardPlanInfos,
        selectedRewardPlan
      });
    },

    getNewlyAdded: function () {
      return this.data.newlyAdded;
    },

    onNewQRCode: function () {
      let that = this;

      let uid = util.getUserId();
      let rewardPlan = this.data.selectedRewardPlan;
      let rewardPlanId = rewardPlan.id;
      let rewardPlanInfo = rewardPlan.info;
      let qrcodeDesc = rewardPlan.info;

      let { userType } = util.getStoredTokens();
      var datasrcFunc = null;
      var qrcodeGenFunc = null;
      if (userType == 'ProfOrgAgent') {
        datasrcFunc = datasrc.proforgagent.saveNewQrcode;
        qrcodeGenFunc = registerUtil.genQRStrMedProf;
      }
      else if (userType == 'ProfOrg') {
        datasrcFunc = datasrc.proforg.saveNewQrcode;
        qrcodeGenFunc = registerUtil.genQRStrProfOrgAgent;
      }
      let newQrcode = qrcodeGenFunc(uid, rewardPlanId, rewardPlanInfo);
      let newQrCodeReq = {
        uid,
        userType: this.data.userType,
        qrcode: newQrcode,
        qrcodeDesc
      };
      console.log('onNewQRCode:', newQrCodeReq);

      toastUtil.waiting(this, true, '保存二维码...');
      datasrcFunc(
        newQrCodeReq,
        respData => {
          console.log('saveNewQrcode', respData);
          let { success, dataOrMsg } = respData;
          let message = success ? '保存成功' : `保存失败: ${dataOrMsg}`;
          if (success) {
            let newlyAdded = this.data.newlyAdded;
            newlyAdded.push(dataOrMsg);
            that.setData({ newlyAdded });
          }
          success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
        }
      );
    },
    onRewardPlanChange: function (e) {
      const { picker, value, index } = e.detail;
      let selectedRewardPlan = this.data.rewardPlans[index];
      console.log("reward plan changed: ", selectedRewardPlan);
      this.setData({ selectedRewardPlan });
    },

    onGoBack: function (e) {
      this.triggerEvent("goback");
    }
  }
})
