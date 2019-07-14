// comp/existing-customer-profile.js
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
    existingCustomer: {},
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
      let selected = products.filter(p => p.checked).map(p => p.name);
      let pricePlanInfos = pricePlans.map(pp => pp.desc);
      this.setData({
        isMock,
        existingCustomer: customerAndProfile.existingCustomer,
        profile: customerAndProfile.profile,
        products,
        selected,
        pricePlans,
        pricePlanInfos
      });
    },
    onPricePlanChange: function (e) {
      const { picker, value, index } = e.detail;
      let selectedPricePlan = this.data.pricePlans[index];
      console.log("price plan changed: ", selectedPricePlan);
      this.setData({ selectedPricePlan });
    },
    getData: function () {
      let { existingCustomer, profile, products, pricePlans, selected } = this.data;
      let selectedProducts = products.filter(p => p.enabled && selected.includes(p.name));
      let pricePlan = this.data.selectedPricePlan;
      return { existingCustomer, profile, selectedProducts, pricePlan };
    },
    onChange(event) {
      console.log('event: ', event)

      this.setData({
        selected: event.detail
      });
    },

    updateExistingCustomer: function (field, e) {
      var t = this.data.existingCustomer;
      t[field] = e.detail;
      this.setData({ existingCustomer: t });
    },
    onInputUserId: function (e) {
      this.updateExistingCustomer("userid", e)
    },
    onInputUserName: function (e) {
      this.updateExistingCustomer("userName", e)
    },
    onInputIdCardNo: function (e) {
      this.updateExistingCustomer("idCardNo", e)
    },
    onInputMobile: function (e) {
      this.updateExistingCustomer("mobile", e)
    },
    setInProgress: function (isInProgress) {
      this.updateExistingCustomer("disabled", { detail: isInProgress });
      let loadingText = isInProgress ? '查找客户中...' : '';
      this.updateExistingCustomer("loadingText", { detail: loadingText });
    },
    onFindCustomerMock: function (e) {
      console.log('todo: search customer', e);
      let that = this;

      setTimeout(
        function () {
          that.setInProgress(false);
          let tmp = {
            ...that.data.existingCustomer,
            userid: 'ne*01',
            userName: '张**',
            idCardNo: '310***816', //'310112197003113821',
            mobile: '137***139', // '13700011100',
          }
          that.setData({
            existingCustomer: tmp
          })

          //console.log('onFindCustomerMock')
          Toast.loading({
            duration: 1000,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: '用户查找失败',
            type: 'fail',
            context: that
          });
        },
        1000
      )
      this.setInProgress(true)

    },
    onFindCustomerProd: function(e) {
      console.log('[todo] onFindCustomerProd')
    },

    onExistingCustomerProfile: function (e) {
      let result = this.getData();
      console.log('[todo] onExistingCustomerProfile: ', result)
    },
    onFindCustomer: function (e) {
      if (this.data.isMock) {
        this.onFindCustomerMock(e);
      }
      else {
        this.onFindCustomerProd(e);
      }
    },
  }
})
