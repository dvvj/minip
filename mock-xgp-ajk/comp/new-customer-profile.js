// comp/new-customer-profile.js
const toastUtil = require('../utils/toast-util.js');
const util = require('../utils/util.js');
const inputCheck = require('../utils/input-check.js');
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
    pricePlanInfos: [],
    errorMsgs: {}
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
      let selectedPricePlan = pricePlans[0];
      this.setData({
        isMock,
        newCustomer,
        profile,
        products,
        selected,
        pricePlans,
        pricePlanInfos,
        selectedPricePlan
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
      this.createNewCustomerProfile();
    },

    hasInputError: function() {
      let errorMsgs = this.data.errorMsgs;

      let keys = Object.keys(errorMsgs);
      var hasError = false;
      keys.forEach ( k => {
        let prop = errorMsgs[k];
        console.log(`${k}: ${prop}`);
        if (prop)
          hasError = true;
      });
      return hasError;
    },
    onNextStep: function(e) {

      if (!this.hasInputError()) {
        this.setData({ activeTabIndex: 1 });
      }
    },

    updateErrorMsg: function(field, msg) {
      let errorMsgs = this.data.errorMsgs;
      errorMsgs[field] = msg;
      console.log('errorMsgs', errorMsgs);
      this.setData({errorMsgs});
    },

    updateNewCustomer: function (field, e) {
      var t = this.data.newCustomer;
      t[field] = e.detail;
      this.setData({ newCustomer: t });
    },

    checkAndUpdateInput: function(field, checker, e) {
      let input = e.detail;
      this.updateNewCustomer(field, e)
      let err = checker.check(input);
      this.updateErrorMsg(field, err);
    },

    onInputUserId: function (e) {
      this.checkAndUpdateInput(
        "userid",
        inputCheck.userid,
        e
      );
    },
    onInputPassword: function (e) {
      this.checkAndUpdateInput(
        "password",
        inputCheck.password,
        e
      );
      //this.updateNewCustomer("password", e)
    },
    onInputPassword2: function (e) {
      this.updateNewCustomer("password2", e)
    },
    onInputUserName: function (e) {
      this.checkAndUpdateInput(
        "userName",
        inputCheck.userName,
        e
      );
      //this.updateNewCustomer("userName", e)
    },
    onInputIdCardNo: function (e) {
      //this.updateNewCustomer("idCardNo", e)
      this.checkAndUpdateInput(
        "idCardNo",
        inputCheck.idCardNo,
        e
      );
    },
    onInputMobile: function (e) {
      //this.updateNewCustomer("mobile", e)
      this.checkAndUpdateInput(
        "mobile",
        inputCheck.mobile,
        e
      );
    },
    onInputPostAddr: function (e) {
      //this.updateNewCustomer("postAddr", e)
      this.checkAndUpdateInput(
        "postAddr",
        inputCheck.postAddr,
        e
      );
    },
    onInputHealthTags: function (e) {
      this.updateNewCustomer("healthTags", e)
    },
    onInputMedicineTags: function (e) {
      this.updateNewCustomer("medicineTags", e)
    },

    convertCustomer: function(wxCustomer) {
      return {
        uid: wxCustomer.userid,
        postalAddr: wxCustomer.postAddr,
        name: wxCustomer.userName,
        passHash: wxCustomer.password,
        idCardNo: wxCustomer.idCardNo,
        mobile: wxCustomer.mobile,
        bday: wxCustomer.bday,
      };
    },
    createNewCustomerProfile: function() {
      let that = this;
      console.log('createNewCustomerProfile: ');

      let { newCustomer, profile, selectedProducts, pricePlan } = this.getData();

      let customer = this.convertCustomer(newCustomer);
      let productIds = selectedProducts.map(p => p.id);
      let profileReq = {
        ...profile,
        pricePlanId: pricePlan.id,
        productIds
      };
      let newCustomerReq = {
        customer, profileReq
      };

      toastUtil.waiting(this, true, '添加用户中')
      datasrc.medprof.createNewCustomerAndProfile(
        newCustomerReq,
        respData => {
          toastUtil.waiting(this, false);
          console.log('respData', respData);
          let { success, msg } = respData;
          let message = success ? '添加成功' : `添加失败: ${msg}`
          success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
        }
      )
    }
  }
})
