// comp/new-customer-profile.js
import Toast from '../vant-lib/toast/toast';
const util = require('../utils/util.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;

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
    isMock: true,
    activeTabIndex: 0,
    inProcess: false,
    loadingText: '',
    newCustomer: {},
    profile: {},
    products: [],
    selected: [],
    pricePlans: [],
    pricePlanInfos: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newCustomerData, isMock) {
      console.log('newCustomerData', newCustomerData);
      let { newCustomer, profile, products, pricePlans } = newCustomerData;
      let selected = products.filter(p => p.checked).map(p => p.shortName);
      let pricePlanInfos = pricePlans.map(pp => pp.desc);
      this.setData({
        isMock,
        newCustomer,
        profile,
        products,
        selected,
        pricePlans,
        pricePlanInfos
      });
    },
    onPricePlanChange: function(e) {
      const { picker, value, index } = e.detail;
      let selectedPricePlan = this.data.pricePlans[index];
      console.log("price plan changed: ", selectedPricePlan);
      this.setData({selectedPricePlan});
    },
    getData: function () {
      let { newCustomer, profile, products, pricePlans, selected } = this.data;
      let selectedProducts = products.filter(p => p.enabled && selected.includes(p.shortName));
      let pricePlan = this.data.selectedPricePlan;
      return { newCustomer, profile, selectedProducts, pricePlan };
    },
    onChange(event) {
      console.log('event: ', event)

      this.setData({
        selected: event.detail
      });
    },
    onNewCustomerProfile: function(e) {
      let result = this.getData();
      console.log('[todo] onNewCustomerProfile: ', result)
      this.onNewCustomerProfile();
    },
    onNextStep: function(e) {
      this.setData({ activeTabIndex: 1});
    },

    updateNewCustomer: function (field, e) {
      var t = this.data.newCustomer;
      t[field] = e.detail;
      this.setData({ newCustomer: t });
    },
    onInputUserId: function (e) {
      this.updateNewCustomer("userid", e)
    },
    onInputPassword: function (e) {
      this.updateNewCustomer("password", e)
    },
    onInputPassword2: function (e) {
      this.updateNewCustomer("password2", e)
    },
    onInputUserName: function (e) {
      this.updateNewCustomer("userName", e)
    },
    onInputIdCardNo: function (e) {
      this.updateNewCustomer("idCardNo", e)
    },
    onInputMobile: function (e) {
      this.updateNewCustomer("mobile", e)
    },
    onInputPostAddr: function (e) {
      this.updateNewCustomer("postAddr", e)
    },
    onInputHealthTags: function (e) {
      this.updateNewCustomer("healthTags", e)
    },
    onInputMedicineTags: function (e) {
      this.updateNewCustomer("medicineTags", e)
    },
    setInProgress: function (isInProgress) {
      //this.updateNewCustomer("disabled", { detail: isInProgress });
      let loadingText = isInProgress ? '添加客户中...' : '';
      this.setData({
        inProcess: isInProgress,
        loadingText
      });
      //this.updateNewCustomer("loadingText", { detail: loadingText });
    },
    
    // onNewCustomerProfileMock: function (e) {
    //   let that = this;
    //   setTimeout(
    //     function () {
    //       that.setInProgress(false);
    //       Toast.loading({
    //         duration: 1000,       // 持续展示 toast
    //         forbidClick: true, // 禁用背景点击
    //         message: '用户添加成功',
    //         type: 'success',
    //         context: that
    //       });
    //     },
    //     1000
    //   );
    //   this.setInProgress(true)
    // },
    onNewCustomerProfile: function() {
      let that = this;
      console.log('onNewCustomerProfile: ');

      let customer = this.data.newCustomer;
      let profileReq = this.data.profile;
      let newCustomerReq = {
        customer, profileReq
      };

      this.setInProgress(true)
      datasrc.medprof.createNewCustomerAndProfile(
        newCustomerReq,
        respData => {
          let { success, msg } = respData;
          that.setInProgress(false);
          Toast.loading({
            duration: 1000,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: msg,
            type: success ? 'success' : 'fail',
            context: that
          });
        }
      )
    }
  }
})
