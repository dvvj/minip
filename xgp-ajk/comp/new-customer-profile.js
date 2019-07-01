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
    initData: function (customerAndProfile, products) {
      let selected = products.filter(p => p.checked).map(p => p.name);
      this.setData({
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
      this.onNewCustomerProfileMock(e);
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
      this.updateNewCustomer("userName", e)
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
          // wx.showToast({
          //   title: `用户添加成功`,
          //   icon: 'success'
          // });
          // Toast.loading({
          //   duration: 1000,       // 持续展示 toast
          //   forbidClick: true, // 禁用背景点击
          //   message: '用户添加成功',
          //   type: 'success'
          // });
          // Toast.loading({
          //   duration: 1000,       // 持续展示 toast
          //   forbidClick: true, // 禁用背景点击
          //   message: '用户添加失败',
          //   type: 'fail'
          // });
          console.log('done onNewCustomerProfileMock')
        },
        1000
      )
      this.setInProgress(true)
      console.log('in onNewCustomer: ', this.data.newCustomer)
    },
  }
})
