const util = require('util.js');

const customerProductUrl = util.customerBaseUrl + '/customerProductView';
const orderListUrl = util.customerBaseUrl + '/ordersBtw';
const customerSettingUrl = util.customerBaseUrl + '/setting';
const customerUpdateSettingUrl = util.customerBaseUrl + '/updateSetting';
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

const reffedCustomersUrl = util.webappBase + '/medprof/reffedCustomerInfos'
const profitStatsUrl = util.medprofBaseUrl + '/profitStats4Wx'

const datasrc = {
  login: function(userid, password) {
    util.promisify(wx.login)()
      .then(({ code }) => {
        console.log(`code: ${code}`)
        wx.request({
          url: util.loginUrl,
          method: 'POST',
          data: {
            wxCode: code,
            userId: userid,
            userPass: password
          },
          success: function (e) {
            console.log('login success', e)
            // const tokens = { xauth: e.header[xAuthHeader], accessToken: e.data.access_token };
            util.saveTokens(e);
            let mainPage = util.getMainPage(e.data.userType);
            console.log(`main page: ${e.data.userType}: ${mainPage}`);
            wx.setStorageSync(util.userIdKey, userid)
            wx.navigateTo({
              url: mainPage //'../product/product-list',
            })
          }
        })
      })
      .catch(function (reason) {
        console.log('failed, reason: ', reason)
      })
  },
  customer: {
    getProductList: (cb) => {
      let tokens = wx.getStorageSync(util.userTokenKey);
      console.log('[GetProducts] got tokens: ', tokens)

      util.promisify(wx.request)
        ({
          url: customerProductUrl,
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('Customer product list:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);
          cb(false, res.data);
          //return res.data;
        })

    },
    getOrderList: (startYearMonth, endYearMonth, cb) => {
      let tokens = wx.getStorageSync(util.userTokenKey);

      console.log('[updateOrderList] got tokens: ', tokens);
      console.log(`[updateOrderList] start ${startYearMonth} end ${endYearMonth}`);
      wx.request({
        url: orderListUrl,
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (orderListReqRes) {
          console.log('orderListReqRes: ', orderListReqRes)
          let ordersRaw = orderListReqRes.data;
          cb(ordersRaw);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })
    },
    getSetting: (cb) => {
      let tokens = wx.getStorageSync(util.userTokenKey);

      console.log('[getSetting] got tokens: ', tokens);
      wx.request({
        url: customerSettingUrl,
        method: "GET",
        header: util.getJsonReqHeader(tokens),
        success: function (customerSettingReqRes) {
          console.log('customerSettingReqRes: ', customerSettingReqRes)
          cb(customerSettingReqRes.data);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })
    },
    updateSetting: (customerSetting, cb) => {
      let tokens = wx.getStorageSync(util.userTokenKey);

      console.log('[updateSetting] got tokens: ', tokens);
      wx.request({
        url: customerUpdateSettingUrl,
        method: "POST",
        data: customerSetting,
        header: util.postJsonReqHeader(tokens),
        success: function (customerUpdateSettingReqRes) {
          console.log('customerUpdateSettingReqRes: ', customerUpdateSettingReqRes)
          cb(customerUpdateSettingReqRes);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })
    }
  },

  medprof: {
    getReffedCustomerInfos: (cb) => {
      let that = this;
      let tokens = wx.getStorageSync(util.userTokenKey);
      console.log('[getReffedCustomerInfos] got tokens: ', tokens)

      wx.request({
        url: reffedCustomersUrl,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + tokens.accessToken,
          'X-Auth-Token': tokens.xauth
        },
        success: function (r1) {
          console.log('reffedCustomersUrl:', r1);
          util.updateXAuth(r1.header[util.xAuthHeader]);
          cb(r1.data);
        }
      })

    },
    getProfitStatsChartData: (startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = wx.getStorageSync(util.userTokenKey);
      console.log('[medprof::getProfitStatsChartData] got tokens: ', tokens)
      console.log(`[medprof::getProfitStatsChartData] start ${startYearMonth} end ${endYearMonth}`);

      wx.request({
        url: profitStatsUrl,
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (reqRes) {
          console.log('updateProfitStats res: ', reqRes)
          cb(reqRes.data);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })

    }
  },

  proforg: {
    getProfitStatsChartData: (startYearMonth, endYearMonth, cb) => {
      console.log(`[todo proforg::getProfitStatsChartData] start ${startYearMonth} end ${endYearMonth}`);
    }
  }

};

module.exports = {
  datasrc: datasrc
};