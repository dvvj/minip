const util = require('util.js');
const regeneratorRuntime = require("regenerator-runtime");

const customerProductUrl = util.customerBaseUrl + '/customerProductView';
const orderListUrl = util.customerBaseUrl + '/ordersBtw';
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

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
      let that = this;
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
    getSetting: () => {
      return {
        disabled: false,
        loadingText: '',
        userid: 'newcustomer02',
        password: '123',
        password2: '123',
        userName: 'x某',
        idCardNo: '310112197003113333',
        mobile: '137000333333',
        postAddr: '某省某市某区某路xx号 邮编111111',
      };
    }
  },

  medprof: {
    getReffedCustomerInfos: () => {
      return [
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
      ];
    },
    getProfitStatsChartData: () => {
      return {
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
      };
    }
  },

  proforg: {
    getProfitStatsChartData: () => {
      return {
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
      };
    }
  }

};

module.exports = {
  datasrc: datasrc
};