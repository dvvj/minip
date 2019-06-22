// pages/mock/medprof/medprof_main.js
const util = require('../../../utils/util.js')
const reffedCustomersUrl = util.webappBase + '/medprof/reffedCustomerInfos'

import Toast from '../../../vant-lib//toast/toast';

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,
    customerInfos: [],
    newCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'newcustomer01',
      password: '123',
      password2: '123',
      userName: '张某',
      idCardNo: '310112197003113821',
      mobile: '13700011100',
      postAddr: '某省某市某区某路xx号 邮编102011',
      healthTags: '高血压，糖尿病',
      medicineTags: '降压药'
    },
    existingCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'existingcustomer01',
      userName: '张某',
      idCardNo: '310112197003113821',
      mobile: '13700011100',
      healthTags: '高血压，糖尿病',
      medicineTags: '降压药'
    }
  },

  // for existing-customer
  updateExistingCustomer: function (field, e) {
    var t = this.data.existingCustomer;
    t[field] = e.detail;
    this.setData({ existingCustomer: t });
  },
  onInputUserId_Existing: function (e) {
    this.updateExistingCustomer("userid", e)
  },
  onInputUserName_Existing: function (e) {
    this.updateExistingCustomer("userName", e)
  },
  onInputIdCardNo_Existing: function (e) {
    this.updateExistingCustomer("idCardNo", e)
  },
  onInputMobile_Existing: function (e) {
    this.updateExistingCustomer("mobile", e)
  },
  // onInputPostAddr: function (e) {
  //   this.setData({ postAddr: e.detail })
  // },
  // onInputHealthTags: function (e) {
  //   this.setData({ healthTags: e.detail })
  // },
  // onInputMedicineTags: function (e) {
  //   this.setData({ medicineTags: e.detail })
  // },
  onClickIcon_InputUserId_Existing: function(e) {
    Toast('请输入用户唯一标识ID');
  },
  setInProgress_Find: function (isInProgress) {
    this.updateExistingCustomer("disabled", { detail: isInProgress });
    let loadingText = isInProgress ? '查找客户中...' : '';
    this.updateExistingCustomer("loadingText", { detail: loadingText });
  },
  onFindCustomer: function (e) {
    console.log('todo: search customer', e);
    let that = this;

    setTimeout(
      function () {
        that.setInProgress_Find(false);
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
        Toast.loading({
          duration: 1000,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: '用户查找失败',
          type: 'fail'
        });
      },
      1000
    )
    this.setInProgress_Find(true)
    console.log('in onFindCustomer: ', this.data.existingCustomer)

  },

  // for new-customer
  updateNewCustomer: function(field, e) {
    var t = this.data.newCustomer;
    t[field] = e.detail;
    this.setData({newCustomer: t});
  },
  onInputUserId: function(e) {
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
  setInProgress: function(isInProgress) {
    this.updateNewCustomer("disabled", { detail: isInProgress });
    let loadingText = isInProgress ? '添加客户中...' : '';
    this.updateNewCustomer("loadingText", { detail: loadingText });
  },
  onNewCustomer: function(e) {
    let that = this;
    setTimeout(
      function() {
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
        Toast.loading({
          duration: 1000,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: '用户添加失败',
          type: 'fail'
        });
      },
      1000
    )
    this.setInProgress(true)
    console.log('in onNewCustomer: ', this.data.newCustomer)
  },

  updateActiveTab: function (tabIndex) {
    this.setData({ activeTabIndex: tabIndex })
  },
  onTabbarChange: function (e) {
    console.log(e)
    wx.showToast({
      title: `切换到标签 ${e.detail}`,
      icon: 'none'
    });
    this.updateActiveTab(e.detail)
  },
  onSwiperChange: function (e) {
    console.log(e.detail.current)
    this.updateActiveTab(e.detail.current)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad00: function (options) {
    let that = this;

    util.promisify(wx.getStorage)({ key: "tokens" })
      .then(res => {
        let tokens = res.data
        console.log('got tokens: ', tokens)

        wx.request({
          url: reffedCustomersUrl,
          method: 'GET',
          header: {
            'Authorization': 'Bearer ' + tokens.accessToken,
            'X-Auth-Token': tokens.xauth
          },
          success: function (r1) {
            console.log('r1:', r1);
            util.saveTokens(r1.header[util.xAuthHeader], tokens.accessToken);

            let rawData = r1.data
            that.setData({ customerInfos: rawData })
          }
        })
      }).catch(function (reason) {
        console.log('failed:', reason);
      })
  },
  onLoad: function (options) {
    let rawData = [
      {
        "profileId": 1,
        "customerName": "张晓东",
        "customerId": "c＿o1a1p1_customer1",
        "productShortNames": [
          "Astaxin虾青素",
          "ACO产妇维生素"
        ],
        "pricePlanInfo": "{\"globalRate\":0.9}",
        "healthTags": [
          "糖尿病",
          "高血压"
        ],
        "medicineTags": [
          "降压药"
        ]
      },
      {
        "profileId": 2,
        "customerName": "张晓",
        "customerId": "c＿o1a1p1_customer2",
        "productShortNames": [
          "Astaxin虾青素",
          "ACO产妇维生素"
        ],
        "pricePlanInfo": "{\"globalRate\":0.9}",
        "healthTags": [
          "糖尿病"
        ],
        "medicineTags": [
          "维生素"
        ]
      },
      {
        "profileId": 3,
        "customerName": "张丽",
        "customerId": "c＿o1a1p1_customer4",
        "productShortNames": [
          "Astaxin虾青素"
        ],
        "pricePlanInfo": "{\"globalRate\":0.9}",
        "healthTags": [
          "贫血"
        ],
        "medicineTags": []
      }
    ]

    this.setData({ customerInfos: rawData })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})