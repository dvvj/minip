// pages/mock/medprof/medprof_main.js
const util = require('../../../utils/util.js')
const reffedCustomersUrl = util.webappBase + '/medprof/reffedCustomerInfos'
const wxCharts = require('../../../utils/wxcharts-min.js');
const newCustomerProfileTabIndex = 2;
const profitStatsTabIndex = 1;
const productListTabIndex = 0;

import Toast from '../../../vant-lib/toast/toast';

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,
    profitStats: {
      startYearMonth: '2018-11',
      endYearMonth: '2019-03'
    },
    customerInfos: [],
    existingCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'existingcustomer01',
      userName: '张某',
      idCardNo: '310112197003113821',
      mobile: '13700011100',
      healthTags: '高血压，糖尿病',
      medicineTags: '降压药'
    },

    newCustomer: {
      disabled: false,
      loadingText: '',
      userid: 'newcustomer02',
      password: '123',
      password2: '123',
      userName: 'x某',
      idCardNo: '310112197003113333',
      mobile: '137000333333',
      postAddr: '某省某市某区某路xx号 邮编111111',
    },
    profile: {
      healthTags: 'healthTags',
      medicineTags: 'medicineTags'
    },
    products: [
      { id: 1, name: 'Astaxin虾青素', enabled: true, checked: false },
      { id: 2, name: 'ACO复合维生素', enabled: true, checked: false },
      { id: 3, name: '辅酶Q10', enabled: false, checked: true }
    ]
  },


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

  updateActiveTab: function (tabIndex) {
    this.updateTabContent(tabIndex);
    this.setData({ activeTabIndex: tabIndex });
  },
  onTabbarChange: function (e) {
    console.log(e)
    let tabIndex = e.detail
    wx.showToast({
      title: `切换到标签 ${tabIndex}`,
      icon: 'none'
    });
    this.updateActiveTab(tabIndex)
  },
  onSwiperChange: function (e) {
    let tabIndex = e.detail.current
    console.log(tabIndex)
    this.updateActiveTab(tabIndex)
  },

  updateTabContent: function(tabIndex) {

    if (tabIndex == profitStatsTabIndex) {
      // todo: cache data
      this.updateProfitTab();
    }
    else if (tabIndex == productListTabIndex) {
      this.updateProductTab();
    }
    else if (tabIndex == newCustomerProfileTabIndex) {
      this.updateNewCustomerProfileTab();
    }
  },

  updateNewCustomerProfileTab: function() {
    let newCustomerProfile = this.selectComponent("#newCustomerProfile");
    console.log(newCustomerProfile);
    newCustomerProfile.initData({
      newCustomer: this.data.newCustomer,
      profile: this.data.profile
    }, this.data.products, true);
  },

  updateProfitTab: function () {
    let rawProfitData = {
      "yearMonths": [
        "2019-01",
        "2019-02",
        "2019-03",
        "2019-04"
      ],
      "sales": [
        9049.939999999999,
        9049.939999999999,
        9349.919999999998,
        0
      ],
      "rewards": [
        2714.982,
        2714.982,
        2804.9759999999997,
        0
      ]
    }

    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: rawProfitData.yearMonths,
      series: [{
        name: '销售额',
        data: util.roundPriceArr(rawProfitData.sales)
      }, {
        name: '佣金',
        data: util.roundPriceArr(rawProfitData.rewards)
      }],
      yAxis: {
        format: function (val) {
          return val + '元';
        }
      },
      width: 360,
      height: 360
    });

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

  updateProductTab: function(that) {
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
  onLoad: function (options) {
    this.updateTabContent(this.data.activeTabIndex);
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