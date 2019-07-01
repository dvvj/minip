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
    newCustomer: {},
    profile: {},
    products: [],
    selected: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (customerAndProfile, products, isMock) {
      let selected = products.filter(p => p.checked).map(p => p.name);
      this.setData({
        isMock,
        newCustomer: customerAndProfile.newCustomer,
        profile: customerAndProfile.profile,
        products,
        selected
      });
    },
    getData: function () {
      let { newCustomer, profile, products, selected } = this.data;
      let selectedProducts = products.filter(p => p.enabled && selected.includes(p.name));
      return { newCustomer, profile, selectedProducts };
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
      this.updateNewCustomer("disabled", { detail: isInProgress });
      let loadingText = isInProgress ? '添加客户中...' : '';
      this.updateNewCustomer("loadingText", { detail: loadingText });
    },
    
    onNewCustomerProfileMock: function (e) {
      let that = this;
      setTimeout(
        function () {
          that.setInProgress(false);
          console.log('done onNewCustomerProfileMock')
        },
        1000
      )
      this.setInProgress(true)
    },
    onNewCustomerProfileProd: function(e) {
      console.log('[todo] onNewCustomerProfileProd: ')
    }
  }
})
