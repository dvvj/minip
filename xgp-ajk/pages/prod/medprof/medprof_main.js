// pages/prod/medprof/medprof_main.js
const util = require('../../../utils/util.js')
const reffedCustomersUrl = util.webappBase + '/medprof/reffedCustomerInfos'

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