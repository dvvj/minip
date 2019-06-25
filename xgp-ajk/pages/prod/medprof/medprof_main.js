// pages/prod/medprof/medprof_main.js
const util = require('../../../utils/util.js')
const reffedCustomersUrl = util.medprofBaseUrl + '/reffedCustomerInfos'
const newCustomersUrl = util.medprofBaseUrl + '/newCustomerAndProfile'
import Toast from '../../../vant-lib/toast/toast';
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

  // for new-customer
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
  onNewCustomer: function (e) {
    let that = this;
    // setTimeout(
    //   function () {
    //     that.setInProgress(false);
    //     // wx.showToast({
    //     //   title: `用户添加成功`,
    //     //   icon: 'success'
    //     // });
    //     // Toast.loading({
    //     //   duration: 1000,       // 持续展示 toast
    //     //   forbidClick: true, // 禁用背景点击
    //     //   message: '用户添加成功',
    //     //   type: 'success'
    //     // });
    //     Toast.loading({
    //       duration: 1000,       // 持续展示 toast
    //       forbidClick: true, // 禁用背景点击
    //       message: '用户添加失败',
    //       type: 'fail'
    //     });
    //   },
    //   1000
    // )
    console.log('in onNewCustomer: ', this.data.newCustomer)
    let c = this.data.newCustomer;
    let customer = {
      uid: c.userid,
      name: c.userName,
      passHash: c.password,
      idCardNo: c.idCardNo,
      mobile: c.mobile,
      postalAddr: c.postAddr,
      bday: '1970-06-11'
    }
    let profileReq = { // todo
      productIds: [1, 2, 3],
      pricePlanId: 'PrFixed-0.95',
      healthTags: c.healthTags,
      medicineTags: c.medicineTags
    }
    this.setInProgress(true);
    let tokens = wx.getStorageSync(util.userTokenKey);
    wx.request({
      url: newCustomersUrl,
      method: 'POST',
      data: { customer, profileReq },
      header: util.postJsonReqHeader(tokens),
      success: function (res) {
        console.log('New Customer:', res);
        //util.saveTokens(r1.header[util.xAuthHeader], tokens.accessToken);
        let code = res.statusCode;
        var toastMsg = '';
        var toastType = '';
        if (code == 200) {
          toastMsg = '用户添加成功';
          toastType = 'success'
        }
        else {
          toastMsg = '用户添加失败：' + res.data;
          toastType = 'fail';
        }
        Toast.loading({
          duration: 1500,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: toastMsg,
          type: toastType
        });
        that.setInProgress(false);
      },
      fail: function (e1) {
        Toast.loading({
          duration: 1500,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: '用户添加失败',
          type: 'fail'
        });
        that.setInProgress(false);
      }
    })
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
        "customerId": "c_o1a1p1c1",
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
        "customerId": "c_o1a1p1c2",
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
        "customerId": "c_o1a1p1c4",
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