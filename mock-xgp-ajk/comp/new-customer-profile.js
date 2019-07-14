// comp/new-customer-profile.js
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
    initData: function (customerAndProfile, products, pricePlans, isMock) {
      let selected = products.filter(p => p.checked).map(p => p.shortName);
      console.log("price plans: ", pricePlans);
      let pricePlanInfos = pricePlans.map(pp => pp.desc);
      this.setData({
        isMock,
        newCustomer: customerAndProfile.newCustomer,
        profile: customerAndProfile.profile,
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
      if (this.data.isMock) {
        this.onNewCustomerProfileMock(e);
      }
      else {
        this.onNewCustomerProfileProd(e);
      }
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
    
    onNewCustomerProfileMock: function (e) {
      let that = this;
      setTimeout(
        function () {
          that.setInProgress(false);
          Toast.loading({
            duration: 1000,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: '用户添加成功',
            type: 'success',
            context: that
          });
        },
        1000
      );
      this.setInProgress(true)
    },
    onNewCustomerProfileProd: function(e) {
      console.log('[todo] onNewCustomerProfileProd: ')
    }
  }
})
