const util = require('util.js');
const cacheUtil = require('cache-util.js');
const imgUtil = require('img-util.js');

const customerProductUrl = util.customerBaseUrl + '/customerProductView';
const customerProductNoUpdateUrl = util.customerBaseUrl + '/customerProductViewNoUpdate';
const orderListUrl = util.customerBaseUrl + '/ordersBtw';
const customerSettingUrl = util.customerBaseUrl + '/setting';
const customerUpdateSettingUrl = util.customerBaseUrl + '/updateSetting';
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

const reffedCustomersUrl = util.medprofBaseUrl + '/reffedCustomerInfos'
const qrcodeListUrl = util.medprofBaseUrl + '/getMedProfCfgs'
const medprofProfitStatsUrl = util.medprofBaseUrl + '/profitStats4Wx';
const medprofProfitStatsPerCustomerUrl = util.medprofBaseUrl + '/profitStats4WxPerCustomer';
const medprofUpdateCustomerProfilePreReqUrl = util.medprofBaseUrl + '/updateCustomerProfilePreReqData';
const medprofUpdateCustomerProfileUrl = util.medprofBaseUrl + '/updateCustomerProfile';
const proforgAgentprofitStatsUrl = util.proforgagentBaseUrl + '/profitStats4Wx';
const proforgAgentProfitStatsPerMedProfUrl = util.proforgagentBaseUrl + '/profitStats4WxPerMedProf';

const newCustomerPreReqDataUrl = util.medprofBaseUrl + '/newCustomerPreReqData';
const newCustomerAndProfileUrl = util.medprofBaseUrl + '/newCustomerAndProfile';

// same data as new customer
const newQrcodePreReqDataUrl = newCustomerPreReqDataUrl;
const saveNewQrcodeUrl = util.medprofBaseUrl + '/newQrcodeCfg';

const medprofListUrl = util.proforgagentBaseUrl + '/medprofList';
const newMedProfPreReqDataUrl = util.proforgagentBaseUrl + '/newMedProfPreReqData';
const newMedProfUrl = util.proforgagentBaseUrl + '/newMedProf';

const profOrgAgentListUrl = util.proforgBaseUrl + '/proforgagentList';
const profOrgProfitStatsUrl = util.proforgBaseUrl + '/profitStats4Wx';
const profOrgProfitStatsPerProfOrgAgentUrl = util.proforgBaseUrl + '/profitStats4WxPerAgent';
const newProfOrgAgentPreReqDataUrl = util.proforgBaseUrl + '/newProfOrgAgentPreReqData';
const newProfOrgAgentUrl = util.proforgBaseUrl + '/newProfOrgAgent';

const registerCustomerUrl = util.registrationBaseUrl + '/customer';

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
            if (success) {
              util.saveTokens(e);
              let { uid, userType } = e.data;
              let mainPage = util.getMainPage(userType);
              console.log(`main page: ${e.data.userType}: ${mainPage}`);
              // userid: uid or phone #, uid: converted from phone # if it's the later case
              wx.setStorageSync(util.userIdKey, uid);
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
  registration: {
    registerCustomer: (registerCustomerReq, cb) => {
      // console.log('[to debug] registerCustomerReq:', registerCustomerReq);
      // let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: registerCustomerUrl,
          method: 'POST',
          data: registerCustomerReq,
          // header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('registerCustomer:', res);
          // util.updateXAuth(res.header[util.xAuthHeader]);
          let success = res.statusCode == 200;
          let msg = res.data;
          cb({ success, msg });
        })
        .catch(function (reason) {
          console.log('registerCustomer failed, reason: ', reason)
        })
    },

  },
  customer: {
    getProductList: (cb) => {
      let uid = util.getUserId();
      let cachedProductList = null; //todo: rethink caching: cacheUtil.getCachedProductList(uid);
      let tokens = util.getStoredTokens();
      console.log('[getProductList] got tokens: ', tokens);

      if (cachedProductList) {
        console.log('using product list in cache, but session token needed');

        util.promisify(wx.request)
          ({
            url: customerProductNoUpdateUrl,
            method: 'GET',
            header: util.getJsonReqHeader(tokens),
          }).then(res => {
            util.updateXAuth(res.header[util.xAuthHeader]);

            cachedProductList.forEach(function (prod) {
              let cachedUrl = cacheUtil.getCachedImgPath(prod.id, false);
              if (cachedUrl)
                prod.imgUrl = cachedUrl;
              let cachedThumbUrl = cacheUtil.getCachedImgPath(prod.id, true);
              if (cachedThumbUrl)
                prod.imgThumbUrl = cachedThumbUrl;
              console.log(`image cached: ${cachedUrl}`);
              console.log(`image thumb cached: ${cachedThumbUrl}`);
            });
            cb(false, cachedProductList);
          });
      }
      else {
        console.log('cache not hit, retrieve product list from ' + customerProductUrl);

        util.promisify(wx.request)
          ({
            url: customerProductUrl,
            method: 'GET',
            header: util.getJsonReqHeader(tokens),
          }).then(res => {
            console.log('Customer product list:', res);
            util.updateXAuth(res.header[util.xAuthHeader]);

            var products = res.data.map(item => {
              let actualPrice = util.roundPrice(item.actualPrice);
              let price0 = util.roundPrice(item.product.price0);
              console.log(`actualPrice: ${actualPrice}; price0: ${price0}`);
              var hasDiscount = actualPrice < price0;
              let prodId = item.product.id;
              let imgThumbUrl = `${util.imgBaseUrl}/${prodId}/${item.productAssets[1].url}`;
              imgUtil.downloadAndCache(prodId, true, imgThumbUrl, function (r) {console.log(`downloadAndCache ${imgThumbUrl}: `, r)})
              let imgUrl = `${util.imgBaseUrl}/${prodId}/${item.productAssets[0].url}`;
              imgUtil.downloadAndCache(prodId, false, imgUrl, function (r) { console.log(`downloadAndCache ${imgUrl}: `, r)})
              var resDataItem = {
                id: prodId,
                imgThumbUrl,
                imgUrl,
                name: item.product.name,
                price0: price0,
                actualPrice: actualPrice,
                hasDiscount: hasDiscount,
                referingProfName: item.referingProfName,
                count: 1,
                totalPrice: actualPrice
              };
              return resDataItem;
            })

            cacheUtil.saveCachedProductList(uid, products);

            cb(false, products);
            //return res.data;
          })
      }


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
    getUpdateCustomerProfilePreReqData: (customerId, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      console.log('[medprof::getUpdateCustomerProfilePreReqData] customerId:', customerId);
      util.promisify(wx.request)
        ({
          url: medprofUpdateCustomerProfilePreReqUrl,
          data: { customerId },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('getUpdateCustomerProfilePreReqData res: ', res)
          cb(res.data);
        }).catch(function (reason) {
          console.log('getUpdateCustomerProfilePreReqData failed, reason: ', reason)
        })

    },
    updateCustomerProfile: (req, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      console.log('[medprof::updateCustomerProfile] req:', req);
      util.promisify(wx.request)
        ({
          url: medprofUpdateCustomerProfileUrl,
          data: req,
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('updateCustomerProfile res: ', res)
          let success = res.statusCode == 200;
          let msg = res.data;
          cb({ success, msg });
        }).catch(function (reason) {
          console.log('updateCustomerProfile failed, reason: ', reason)
        })

    },
    getQRCodeList: (cb) => {
      let tokens = util.getStoredTokens();
      console.log('[getQRCodeList] got tokens: ', tokens);

      wx.request({
        url: qrcodeListUrl,
        method: "GET",
        header: util.getJsonReqHeader(tokens),
        success: function (qrcodeListRes) {
          console.log('qrcodeListRes: ', qrcodeListRes)
          let qrcodes = qrcodeListRes.data;
          cb(qrcodes);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })
    },
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
    getProfitStatsChartDataPerCustomer: (customerId, startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      console.log(`[medprof::getProfitStatsChartDataPerCustomer] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);
      util.promisify(wx.request)
        ({
          url: medprofProfitStatsPerCustomerUrl,
          data: { customerId, startYearMonth, endYearMonth },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('medprofProfitStatsPerCustomer res: ', res)
          cb(res.data);
        }).catch(function (reason) {
          console.log('medprofProfitStatsPerCustomer failed, reason: ', reason)
        })
    },
    getNewQrcodeData: (cb) => {
      let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: newQrcodePreReqDataUrl,
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('newQrcodePreReqData:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);

          let products = res.data.products;
          // check all products by default
          products.forEach(function(prod) {prod.checked = true;});
          console.log("products: ", products);
          let pricePlans = res.data.pricePlans;
          console.log("pricePlans: ", pricePlans);

          cb({ products, pricePlans });

          //return res.data;
        })
    },
    saveNewQrcode: (req, cb) => {
      let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: saveNewQrcodeUrl,
          method: 'POST',
          data: req,
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('saveNewQrcode:', res);
          util.updateXAuth(res.header[util.xAuthHeader]);

          let success = res.statusCode == 200;
          let dataOrMsg = res.data;
          cb({ success, dataOrMsg });

          //return res.data;
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
            mobile: '13700033333',
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
          mobile: '13700033333',
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
    getProfitStatsChartDataPerMedProf: (profId, startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      console.log(`[proforgagent::getProfitStatsChartDataPerMedProf] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);
      util.promisify(wx.request)
        ({
          url: proforgAgentProfitStatsPerMedProfUrl,
          data: { profId, startYearMonth, endYearMonth },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('ProfitStatsChartDataPerMedProf res: ', res)
          cb(res.data);
        }).catch(function (reason) {
          console.log('getProfitStatsChartDataPerMedProf failed, reason: ', reason)
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
            mobile: '13700033333',
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

    getProfitStatsChartDataPerProfOrgAgent: (agentId, startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      console.log(`[proforg::getProfitStatsChartDataPerProfOrgAgent] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);
      util.promisify(wx.request)
        ({
          url: profOrgProfitStatsPerProfOrgAgentUrl,
          data: { agentId, startYearMonth, endYearMonth },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('getProfitStatsChartDataPerProfOrgAgent res: ', res)
          cb(res.data);
        }).catch(function (reason) {
          console.log('getProfitStatsChartDataPerProfOrgAgent failed, reason: ', reason)
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
            mobile: '13700033333',
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