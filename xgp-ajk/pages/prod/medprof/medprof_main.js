// pages/prod/medprof/medprof_main.js
const util = require('../../../utils/util.js')
const reffedCustomersUrl = util.medprofBaseUrl + '/reffedCustomerInfos'
const newCustomersUrl = util.medprofBaseUrl + '/newCustomerAndProfile'
const existingCustomersUrl = util.medprofBaseUrl + '/existingCustomerNewProfile'
const findCustomersUrl = util.medprofBaseUrl + '/findCustomers'
const profitStatsUrl = util.medprofBaseUrl + '/profitStats4Wx'

import Toast from '../../../vant-lib/toast/toast';
import Dialog from '../../../vant-lib/dialog/dialog';
const wxCharts = require('../../../utils/wxcharts-min.js');
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
      userid: 'c_o1a1p1c3',
      userName: '',
      idCardNo: '',
      mobile: '',
      healthTags: '高血压，糖尿病',
      medicineTags: '降压药'
    },
    profitStats: {
      start: { year: 2018, month: 11 },
      end: { year: 2019, month: 3 },
      profit: []
    },
    yearMonthPicker: {
      activeTabIndex: 0,
      start: { year: 2018, month: 11 },
      end: { year: 2019, month: 3 },
      current: new Date().getTime()
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }

  },

  onMonthPickerChangeTab: function (e) {
    let newIndex = e.detail.index;
    let t = {
      ...this.data.yearMonthPicker,
      activeTabIndex: newIndex
    };
    this.setData({ yearMonthPicker: t })
  },
  onMonthPickerConfirm: function (e) {
    console.log('onMonthPickerConfirm', e)
    let date = new Date(e.detail)
    let t = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
    let res = { year: t.year, month: t.month }

    let t2 = {
      ...this.data.yearMonthPicker,
    };
    if (this.data.yearMonthPicker.activeTabIndex == 0) {
      let start = res;
      t2['start'] = start;
    }
    else {
      let end = res;
      t2['end'] = res;
    }
    this.setData({ yearMonthPicker: t2 });
  },
  onMonthPickerCancel: function (e) {
    Dialog.close();
  },
  onSetYearMonth: function (e) {
    this.showDialog('设置起止年月', 'start')
  },
  onYMDlgConfirm: function (e) {
    console.log('confirmed: ', this.data.yearMonthPicker);
    let t = {
      ...this.data.profitStats,
      start: this.data.yearMonthPicker.start,
      end: this.data.yearMonthPicker.end
    };
    this.setData({ profitStats: t })

    this.updateProfitStats();
  },
  updateProfitStats: function () {
    let t = this.data.profitStats;
    let startYearMonth = `${t.start.year}-${t.start.month}`;
    let endYearMonth = `${t.end.year}-${t.end.month}`;
    let that = this;
    util.promisify(wx.getStorage)({ key: util.userTokenKey })
      .then(res => {
        let tokens = res.data
        console.log('[updateProfitStats] got tokens: ', tokens)
        wx.request({
          url: profitStatsUrl,
          data: { startYearMonth, endYearMonth },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
          success: function (reqRes) {
            console.log('updateProfitStats res: ', reqRes)
            let profitData = {
              ...that.data.profitStats,
              profit: reqRes.data
            }
            that.setData({ profitStats: profitData });
            let rawData = reqRes.data;
            new wxCharts({
              canvasId: 'columnCanvas',
              type: 'column',
              categories: rawData.yearMonths,
              series: [{
                name: '销售额',
                data: util.roundPriceArr(rawData.sales)
              }, {
                name: '佣金',
                data: util.roundPriceArr(rawData.rewards)
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
          fail: function (e2) {
            console.info("e2: ", e2)
          }
        })
      })
  },
  showDialog: function (title, dlgType) {
    this.setData({ dlgType: dlgType });
    Dialog.alert({
      title: title,
      showConfirmButton: true,
      showCancelButton: true
    }).then(() => {
      // on close
    }).catch(reason => console.log('cancelled: ', reason));
  },

  updateActiveTab: function (tabIndex) {
    this.setData({ activeTabIndex: tabIndex });
    this.updateTabContent(tabIndex);
  },
  updateTabContent: function(tabIndex) {
    if (tabIndex == 1) {
      this.updateProfitStats();
    }
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
  onClickIcon_InputUserId_Existing: function (e) {
    Toast('请输入用户唯一标识ID');
  },
  setInProgress_Find: function (isInProgress) {
    this.updateExistingCustomer("disabled", { detail: isInProgress });
    let loadingText = isInProgress ? '查找客户中...' : '';
    this.updateExistingCustomer("loadingText", { detail: loadingText });
  },
  onFindCustomer: function (e) {
    console.log('Search customer', e);
    let that = this;
    let c = this.data.existingCustomer;
    let findReq = {
      customerId: c.userid,
      mobile: c.mobile,
      idCardNo: c.idCardNo,
      name: c.userName
    };

    let tokens = wx.getStorageSync(util.userTokenKey);
        this.setInProgress_Find(true)
    console.log('in onFindCustomer: ', this.data.existingCustomer)
    wx.request({
      url: findCustomersUrl,
      method: 'POST',
      data: findReq,
      header: util.postJsonReqHeader(tokens),
      success: function (res) {
        console.log('Find Customer:', res);
        //util.saveTokens(r1.header[util.xAuthHeader], tokens.accessToken);
        let code = res.statusCode;
        var toastMsg = '';
        var toastType = '';
        if (code == 200 && res.data.length > 0) {
          toastMsg = '用户查找成功';
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
        that.setInProgress_Find(false);
      },
      fail: function (e1) {
        Toast.loading({
          duration: 1500,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: '用户添加失败',
          type: 'fail'
        });
        that.setInProgress_Find(false);
      }
    })
  },
  onNewCustomerProfile: function (e) {
    let that = this;
    let c = this.data.existingCustomer;
    let profileReq = { // todo
      productIds: [1, 2, 3],
      pricePlanId: 'PrFixed-0.95',
      healthTags: c.healthTags,
      medicineTags: c.medicineTags
    };
    let req = {
      customerId: c.userid,
      profileReq
    };
    let tokens = wx.getStorageSync(util.userTokenKey);
    this.setInProgress_Find(true)
    console.log('in onNewCustomerProfile: ', this.data.existingCustomer)
    wx.request({
      url: existingCustomersUrl,
      method: 'POST',
      data: req,
      header: util.postJsonReqHeader(tokens),
      success: function (res) {
        console.log('Existing Customer:', res);
        //util.saveTokens(r1.header[util.xAuthHeader], tokens.accessToken);
        let code = res.statusCode;
        var toastMsg = '';
        var toastType = '';
        if (code == 200) {
          toastMsg = '用户档案添加成功';
          toastType = 'success'
        }
        else {
          toastMsg = '用户档案添加失败：' + res.data;
          toastType = 'fail';
        }
        Toast.loading({
          duration: 1500,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: toastMsg,
          type: toastType
        });
        that.setInProgress_Find(false);
      },
      fail: function (e1) {
        Toast.loading({
          duration: 1500,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: '用户添加失败',
          type: 'fail'
        });
        that.setInProgress_Find(false);
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