const util = require('util.js');

const customerProductUrl = util.customerBaseUrl + '/customerProductView';
const orderListUrl = util.customerBaseUrl + '/ordersBtw';
const customerSettingUrl = util.customerBaseUrl + '/setting';
const customerUpdateSettingUrl = util.customerBaseUrl + '/updateSetting';
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

const reffedCustomersUrl = util.webappBase + '/medprof/reffedCustomerInfos'
const medprofProfitStatsUrl = util.medprofBaseUrl + '/profitStats4Wx';
const proforgAgentprofitStatsUrl = util.proforgagentBaseUrl + '/profitStats4Wx';

const newCustomerPreReqDataUrl = util.medprofBaseUrl + '/newCustomerPreReqData';
const newCustomerAndProfileUrl = util.medprofBaseUrl + '/newCustomerAndProfile';

const medprofListUrl = util.proforgagentBaseUrl + '/medprofList';
const newMedProfPreReqDataUrl = util.proforgagentBaseUrl + '/newMedProfPreReqData';
const newMedProfUrl = util.proforgagentBaseUrl + '/newMedProf';

const profOrgAgentListUrl = util.proforgBaseUrl + '/proforgagentList';
const profOrgProfitStatsUrl = util.proforgBaseUrl + '/profitStats4Wx';
const newProfOrgAgentPreReqDataUrl = util.proforgBaseUrl + '/newProfOrgAgentPreReqData';
const newProfOrgAgentUrl = util.proforgBaseUrl + '/newProfOrgAgent';

const _parseResponse = function(resp, error401) {
  let status = resp.statusCode;
  let success = 200 == status;
  let msg = success ? '' : (status == 401 ? '用户名/密码错误' : '未知错误');
  return { success, msg, status };
};

const parseResponse4Login = function (resp) {
  return _parseResponse(resp, '用户名/密码错误');
};
const parseResponseGeneral = function (resp) {
  return _parseResponse(resp, '未授权，登录超时？');
};

const datasrc = {
  login: function(userid, password, cb) {
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
            let { success, msg, status } = parseResponse4Login(e);
            console.log(`datasrc.login success, status: ${status}`, e);
            cb({ success, msg });
            // const tokens = { xauth: e.header[xAuthHeader], accessToken: e.data.access_token };
            if (success) {
              util.saveTokens(e);
              let mainPage = util.getMainPage(e.data.userType);
              console.log(`main page: ${e.data.userType}: ${mainPage}`);
              wx.setStorageSync(util.userIdKey, userid)
              wx.navigateTo({
                url: mainPage //'../product/product-list',
              })
            }
          },
          fail: function(err) {
            console.log('login failed', err)
            cb({
              success: false,
              msg: '登录失败'
            });
          }
        })
      })
      .catch(function (reason) {
        console.log('failed, reason: ', reason)
      })
  },
  customer: {
    getProductList: (cb) => {
      let tokens = util.getStoredTokens();
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
      let tokens = util.getStoredTokens();

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
      let tokens = util.getStoredTokens();

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
      let tokens = util.getStoredTokens();

      console.log('[updateSetting] got tokens: ', tokens);
      wx.request({
        url: customerUpdateSettingUrl,
        method: "POST",
        data: customerSetting,
        header: util.postJsonReqHeader(tokens),
        success: function (resp) {
          console.log('customerUpdateSettingReqRes: ', resp)
          let { success, msg, status } = parseResponseGeneral(resp); 
          cb({ success, msg });
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
      let tokens = util.getStoredTokens();
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
      let tokens = util.getStoredTokens();
      console.log(`[medprof::getProfitStatsChartData] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);

      wx.request({
        url: medprofProfitStatsUrl,
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

    },
    getNewCustomerData: (cb) => {
      let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: newCustomerPreReqDataUrl,
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('newCustomerPreReqData:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);

          let products = res.data.products;
          console.log("products: ", products);
          let pricePlans = res.data.pricePlans;
          console.log("pricePlans: ", pricePlans);

          let newCustomer = {
            userid: 'c-',
            password: '123',
            password2: '123',
            userName: '张某',
            idCardNo: '310112197003113333',
            mobile: '137000333333',
            postAddr: '某省某市某区某路xx号 邮编111111'
          };
          let profile = {
            healthTags: '糖尿病',
            medicineTags: '板蓝根'
          };
          cb({ newCustomer, profile, products, pricePlans });

          //return res.data;
        })
    },
    createNewCustomerAndProfile: (newCustomerReq, cb) => {
      // console.log('[to debug] createNewCustomerAndProfile:', newCustomerReq);
      let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: newCustomerAndProfileUrl,
          method: 'POST',
          data: newCustomerReq,
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('createNewCustomerAndProfile:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);
          let success = res.statusCode == 200;
          let msg = res.data;
          cb({success, msg});
        })
        .catch(function (reason) {
          console.log('createNewCustomerAndProfile failed, reason: ', reason)
        })
    },
    getExistingCustomerData: function(cb) {
      console.log('[todo] getExistingCustomerData')
      setTimeout(function () {
        let existingCustomer = {
          disabled: false,
          loadingText: '',
          userid: 'newcustomer02',
          userName: 'x某',
          idCardNo: '310112197003113333',
          mobile: '137000333333',
          profile: {
            healthTags: '高血压',
            medicineTags: '降压药'
          },
          products: [
            { id: 1, name: 'Astaxin虾青素', enabled: true, checked: false },
            { id: 2, name: 'ACO复合维生素', enabled: true, checked: false },
            { id: 3, name: '辅酶Q10', enabled: false, checked: true }
          ],
          pricePlans: [
            {
              "id": "PrFixed-0.9",
              "desc": "所有商品9折"
            },
            {
              "id": "PrFixed-0.9_P112",
              "desc": "所有商品95折"
            },
            {
              "id": "PrFixed-0.95",
              "desc": "所有商品95折"
            },
            {
              "id": "PrProdBased-Advanced",
              "desc": "【商品1】8折，【商品2】85折，其余9折"
            },
            {
              "id": "PrProdBased-Basic",
              "desc": "【商品1】9折，【商品2】85折，其余95折"
            }
          ]
        };
        cb(existingCustomer);
      }, 1000);

    }
  },

  proforgagent: {
    getMedProfs: (cb) => {
      let that = this;
      let tokens = util.getStoredTokens();

      wx.request({
        url: medprofListUrl,
        method: "GET",
        header: util.postJsonReqHeader(tokens),
        success: function (medProfsRes) {
          console.log('medProfsRes: ', medProfsRes)
          util.updateXAuth(medProfsRes.header[util.xAuthHeader]);
          cb(medProfsRes.data);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })
    },

    getProfitStatsChartData: (startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      console.log(`[orgagent::getProfitStatsChartData] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);

      wx.request({
        url: proforgAgentprofitStatsUrl,
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (reqRes) {
          console.log('orgagent::getProfitStatsChartData res: ', reqRes)
          util.updateXAuth(reqRes.header[util.xAuthHeader]);
          cb(reqRes.data);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })

    },

    getNewMedProfData: (cb) => {
      let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: newMedProfPreReqDataUrl,
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('newMedProfPreReqData:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);

          let rewardPlans = res.data.rewardPlans;
          console.log("reward plans: ", rewardPlans);

          let newMedProf = {
            profid: 'p-',
            password: '123',
            password2: '123',
            name: '张某',
            idCardNo: '310112197003113333',
            mobile: '137000333333',
            info: '脑,心血管'
          };

          cb({ newMedProf, rewardPlans });

          //return res.data;
        })
    },
    createNewMedProf: function(newMedProReq, cb) {
      let tokens = util.getStoredTokens();
      console.log('newMedProReq', newMedProReq);
      util.promisify(wx.request)
        ({
          url: newMedProfUrl,
          method: 'POST',
          data: newMedProReq,
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('createNewMedProf:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);
          let success = res.statusCode == 200;
          let msg = res.data;
          cb({ success, msg });
        })
        .catch(function (reason) {
          console.log('createNewMedProf failed, reason: ', reason)
        })

    }
  },

  proforg: {
    getProfOrgAgentList: (cb) => {
      let that = this;
      let tokens = util.getStoredTokens();

      wx.request({
        url: profOrgAgentListUrl,
        method: "GET",
        header: util.postJsonReqHeader(tokens),
        success: function (agentListRes) {
          console.log('agentListRes: ', agentListRes)
          util.updateXAuth(agentListRes.header[util.xAuthHeader]);
          cb(agentListRes.data);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })
    },

    getProfitStatsChartData: (startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      console.log(`[proforg::getProfitStatsChartData] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);

      wx.request({
        url: profOrgProfitStatsUrl,
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (reqRes) {
          console.log('orgagent::getProfitStatsChartData res: ', reqRes)
          util.updateXAuth(reqRes.header[util.xAuthHeader]);
          cb(reqRes.data);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })

    },

    getNewProfOrgAgentData: function(cb) {
      let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: newProfOrgAgentPreReqDataUrl,
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('getNewProfOrgAgentData:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);

          let rewardPlans = res.data.rewardPlans;
          console.log("reward plans: ", rewardPlans);

          let newProfOrgAgent = {
            agentid: 'a-',
            password: '123',
            password2: '123',
            name: '张某',
            mobile: '137000333333',
            info: '业务员信息'
          };

          cb({ newProfOrgAgent, rewardPlans });

          //return res.data;
        })
    },
    createNewProfOrgAgent: function (newProfOrgAgent, cb) {
      let tokens = util.getStoredTokens();
      console.log('newProfOrgAgent', newProfOrgAgent);
      util.promisify(wx.request)
        ({
          url: newProfOrgAgentUrl,
          method: 'POST',
          data: newProfOrgAgent,
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('createNewProfOrgAgent:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);
          let success = res.statusCode == 200;
          let msg = res.data;
          cb({ success, msg });
        })
        .catch(function (reason) {
          console.log('createNewProfOrgAgent failed, reason: ', reason)
        })

    }
  }

};

module.exports = {
  datasrc: datasrc
};