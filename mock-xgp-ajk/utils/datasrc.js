const util = require('util.js');
const cacheUtil = require('cache-util.js');
const imgUtil = require('img-util.js');

const customerProductUrl = function() {
  return util.getCustomerBaseUrl() + '/customerProductView';
};

const customerProductNoUpdateUrl = function () {
  return util.getCustomerBaseUrl() + '/customerProductViewNoUpdate';
};
const orderListUrl = function () {
  return util.getCustomerBaseUrl() + '/ordersBtw';
};
const customerSettingUrl = function () {
  return util.getCustomerBaseUrl() + '/setting';
};
const customerUpdateSettingUrl = function () {
  return util.getCustomerBaseUrl() + '/updateSetting';
};
// const wxPayUrl = function () {
//   return util.getWebappBase() + '/wx/payReq';
// };

const medprofReffedCustomersUrl = function () {
  return util.getMedprofBaseUrl() + '/reffedCustomerInfos';
};
const medprofSaveNewQrcodeUrl = function () {
  return util.getMedprofBaseUrl() + '/newQrcodeCfg';
};
const medprofQrcodeListUrl = function () {
  return util.getMedprofBaseUrl() + '/getQrCodeCfgs';
};
const medprofProfitStatsUrl = function () {
  return util.getMedprofBaseUrl() + '/profitStats4Wx';
};
const medprofProfitStatsPerCustomerUrl = function () {
  return util.getMedprofBaseUrl() + '/profitStats4WxPerCustomer';
};
const medprofUpdateCustomerProfilePreReqUrl = function () {
  return util.getMedprofBaseUrl() + '/updateCustomerProfilePreReqData';
};
const medprofUpdateCustomerProfileUrl = function () {
  return util.getMedprofBaseUrl() + '/updateCustomerProfile';
};

const proforgAgentprofitStatsUrl = function () {
  return util.getProforgagentBaseUrl() + '/profitStats4Wx';
};
const proforgAgentMedProfQrcodeListUrl = function () {
  return util.getProforgagentBaseUrl() + '/getMedProfQrCodeCfgs';
};
const proforgAgentCustomerQrcodeListUrl = function () {
  return util.getProforgagentBaseUrl() + '/getCustomerQrCodeCfgs';
};
const proforgAgentSaveNewQrcodeUrl = function () {
  return util.getProforgagentBaseUrl() + '/newQrcodeCfg';
};
const proforgAgentProfitStatsPerMedProfUrl = function () {
  return util.getProforgagentBaseUrl() + '/profitStats4WxPerMedProf';
};
const proforgAgentReffedCustomersUrl = function () {
  return util.getProforgagentBaseUrl() + '/reffedCustomerInfos';
};
const proforgagentProfitStatsPerCustomerUrl = function () {
  return util.getProforgagentBaseUrl() + '/profitStats4WxPerCustomer';
};
const newCustomerPreReqDataUrl = function () {
  return util.getMedprofBaseUrl() + '/newCustomerPreReqData';
};
const newCustomerAndProfileUrl = function () {
  return util.getMedprofBaseUrl() + '/newCustomerAndProfile';
};

// same data as new customer
const newQrcodePreReqDataUrl = function () {
  return newCustomerPreReqDataUrl();
};

const medprofListUrl = function () {
  return util.getProforgagentBaseUrl() + '/medprofList';
};
const newMedProfPreReqDataUrl = function () {
  return util.getProforgagentBaseUrl() + '/newMedProfPreReqData';
};
const newMedProfQrcodePreReqDataUrl = function () {
  return newMedProfPreReqDataUrl();
};
const newMedProfUrl = function () {
  return util.getProforgagentBaseUrl() + '/newMedProf';
};

const profOrgAgentListUrl = function () {
  return util.getProforgBaseUrl() + '/proforgagentList';
};
const profOrgProfitStatsUrl = function () {
  return util.getProforgBaseUrl() + '/profitStats4Wx';
};
const profOrgGetAgentQrcodeListUrl = function () {
  return util.getProforgBaseUrl() + '/getQrCodeCfgs';
};
const profOrgProfitStatsPerProfOrgAgentUrl = function () {
  return util.getProforgBaseUrl() + '/profitStats4WxPerAgent';
};
const newProfOrgAgentPreReqDataUrl = function () {
  return util.getProforgBaseUrl() + '/newProfOrgAgentPreReqData';
};
const newProfOrgAgentUrl = function () {
  return util.getProforgBaseUrl() + '/newProfOrgAgent';
};
const profOrgSaveNewQrcodeUrl = function () {
  return util.getProforgBaseUrl() + '/newQrcodeCfg';
};

const registerCustomerUrl = function () {
  return util.getRegistrationBaseUrl() + '/customer';
};

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

const _getReffedCustomerInfos = (url, cb) => {
  let tokens = util.getStoredTokens();
  const methodName = "_getReffedCustomerInfos";
  console.log(`${methodName} got tokens: `, tokens)

  wx.request({
    url: url, //reffedCustomersUrl(),
    method: 'GET',
    header: {
      'Authorization': 'Bearer ' + tokens.accessToken,
      'X-Auth-Token': tokens.xauth
    },
    success: function (r1) {
      console.log('getReffedCustomerInfos:', r1);
      if (checkRespStatus(r1, methodName)) {
        util.updateXAuth(r1.header[util.xAuthHeader]);
        cb(r1.data);
      }

    }
  })
};

const medprofGetReffedCustomerInfos = (cb) => {
  _getReffedCustomerInfos(
    medprofReffedCustomersUrl(),
    cb
  );
};
const proforgagentGetReffedCustomerInfos = (cb) => {
  _getReffedCustomerInfos(
    proforgAgentReffedCustomersUrl(),
    cb
  );
};
const _getProfitStatsChartDataPerCustomer = (url, customerId, startYearMonth, endYearMonth, cb) => {
  let tokens = util.getStoredTokens();
  const methodName = "_getProfitStatsChartDataPerCustomer";
  console.log(`[medprof::getProfitStatsChartDataPerCustomer] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);
  util.promisify(wx.request)
    ({
      url: url, //medprofProfitStatsPerCustomerUrl(),
      data: { customerId, startYearMonth, endYearMonth },
      method: "POST",
      header: util.postJsonReqHeader(tokens),
    }).then(res => {
      console.log('medprofProfitStatsPerCustomer res: ', res)
      if (checkRespStatus(res, methodName)) {
        cb(res.data);
      }

    }).catch(function (reason) {
      requestFail(reason, methodName);
    })
};

const medprofGetProfitStatsChartDataPerCustomer = (customerId, startYearMonth, endYearMonth, cb) => {
  _getProfitStatsChartDataPerCustomer(
    medprofProfitStatsPerCustomerUrl(),
    customerId, startYearMonth, endYearMonth, cb
  )
};
const proforgagentGetProfitStatsChartDataPerCustomer = (customerId, startYearMonth, endYearMonth, cb) => {
  _getProfitStatsChartDataPerCustomer(
    proforgagentProfitStatsPerCustomerUrl(),
    customerId, startYearMonth, endYearMonth, cb
  )
};

const _getQRCodeList = (url, cb) => {
  let tokens = util.getStoredTokens();
  const methodName = "_getQRCodeList";
  console.log(`${methodName} got tokens: `, tokens);

  wx.request({
    url: url, //qrcodeListUrl(),
    method: "GET",
    header: util.getJsonReqHeader(tokens),
    success: function (qrcodeListRes) {
      console.log('qrcodeListRes: ', qrcodeListRes)
      if (checkRespStatus(qrcodeListRes, methodName)) {
        let qrcodes = qrcodeListRes.data;
        cb(qrcodes);
      }
    },
    fail: err => requestFail(err, methodName)
  })
};

const medprofGetQRCodeList = (cb) => {
  _getQRCodeList(
    medprofQrcodeListUrl(),
    cb
  );
};
const proforgagentGetMedProfQRCodeList = (cb) => {
  _getQRCodeList(
    proforgAgentMedProfQrcodeListUrl(),
    cb
  );
};
const proforgagentGetCustomerQRCodeList = (cb) => {
  _getQRCodeList(
    proforgAgentCustomerQrcodeListUrl(),
    cb
  );
};
const proforgGetQRCodeList = (cb) => {
  _getQRCodeList(
    profOrgGetAgentQrcodeListUrl(),
    cb
  );
};

const _saveNewQrcode = (url, req, cb) => {
  let tokens = util.getStoredTokens();
  const methodName = "_saveNewQrcode";
  util.promisify(wx.request)
    ({
      url: url, //saveNewQrcodeUrl(),
      method: 'POST',
      data: req,
      header: util.postJsonReqHeader(tokens),
    }).then(res => {
      console.log('saveNewQrcode:', res);

      if (checkRespStatus(res, methodName)) {
        util.updateXAuth(res.header[util.xAuthHeader]);

        let success = res.statusCode == 200;
        let dataOrMsg = res.data;
        cb({ success, dataOrMsg });
      }

    }).catch(function (reason) {
      requestFail(reason, methodName);
    })
};

const medprofSaveNewQrcode = (req, cb) => {
  _saveNewQrcode(
    medprofSaveNewQrcodeUrl(),
    req, cb
  );
};

const proforgagentSaveNewQrcode = (req, cb) => {
  _saveNewQrcode(
    proforgAgentSaveNewQrcodeUrl(),
    req, cb
  );
};

const proforgSaveNewQrcode = (req, cb) => {
  _saveNewQrcode(
    profOrgSaveNewQrcodeUrl(),
    req, cb
  );
}

const resetToLoginPage = (errorReason) => {
  wx.reLaunch({
    url: `/pages/prod/login-or-register?er=${errorReason}`
  });
};

const switchUserToLoginPage = suid => {
  wx.reLaunch({
    url: `/pages/prod/login-or-register?su=${suid}`
  });
}

const requestFail = (err, methodName) => {
  const reason = `【${methodName}】调用失败`;
  console.log(reason, err);
  resetToLoginPage(reason);
};

const serverRespError = (err, methodName) => {
  //const reason = `【${methodName}】服务器返回错误：${err}`;
  const reason = `登录超时（${err}）`;
  console.log(reason, err);
  resetToLoginPage(reason);
};

const checkRespStatus = (resp, methodName) => {
  const success = resp.statusCode === 200;
  if (!success) {
    const errMsg = `状态码 ${resp.statusCode}`;
    serverRespError(errMsg, methodName);
  }
  return success;
};

const datasrc = {
  switchUserToLoginPage,
  login: function(userid, password, cb) {
    util.promisify(wx.login)()
      .then(({ code }) => {
        console.log(`code: ${code}`)
        wx.request({
          url: util.getLoginUrl(),
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
          url: registerCustomerUrl(),
          method: 'POST',
          data: registerCustomerReq,
          // header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('registerCustomer:', res);
          // util.updateXAuth(res.header[util.xAuthHeader]);
          // let success = res.statusCode == 200;
          // let msg = res.data;
          cb(res.data);
        }).catch(function (reason) {
          console.log('registerCustomer failed, reason: ', reason)
        })
    },

  },
  customer: {
    getProductList: (cb) => {
      let uid = util.getUserId();
      let cachedProductList = null; //todo: rethink caching: cacheUtil.getCachedProductList(uid);
      let tokens = util.getStoredTokens();
      const methodName = "getProductList"
      console.log(`${methodName} got tokens: `, tokens);

      if (cachedProductList) {
        console.log('using product list in cache, but session token needed');

        util.promisify(wx.request)
          ({
            url: customerProductNoUpdateUrl(),
            method: 'GET',
            header: util.getJsonReqHeader(tokens),
          }).then(res => {

            if (checkRespStatus(res, methodName)) {
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
            }

          }).catch(function (reason) {
            requestFail(reason, methodName);
          });
      }
      else {
        console.log('cache not hit, retrieve product list from ' + customerProductUrl());

        util.promisify(wx.request)
          ({
            url: customerProductUrl(),
            method: 'GET',
            header: util.getJsonReqHeader(tokens),
          }).then(res => {
            console.log('Customer product list:', res);
            if (checkRespStatus(res, methodName)) {
              util.updateXAuth(res.header[util.xAuthHeader]);

              var products = res.data.map(item => {
                let actualPrice = util.roundPrice(item.actualPrice);
                let price0 = util.roundPrice(item.product.price0);
                console.log(`actualPrice: ${actualPrice}; price0: ${price0}`);
                var hasDiscount = actualPrice < price0;
                let prodId = item.product.id;
                let imgThumbUrl = `${util.getImgBaseUrl()}/${prodId}/${item.productAssets[1].url}`;
                imgUtil.downloadAndCache(prodId, true, imgThumbUrl, function (r) { console.log(`downloadAndCache ${imgThumbUrl}: `, r) })
                let imgUrl = `${util.getImgBaseUrl()}/${prodId}/${item.productAssets[0].url}`;
                imgUtil.downloadAndCache(prodId, false, imgUrl, function (r) { console.log(`downloadAndCache ${imgUrl}: `, r) })
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
            }

            //return res.data;
          }).catch(function (reason) {
            requestFail(reason, methodName);
          });
      }


    },
    getOrderList: (startYearMonth, endYearMonth, cb) => {
      let tokens = util.getStoredTokens();
      const methodName = "getOrderList";
      console.log(`${methodName} got tokens: `, tokens);
      console.log(`${methodName} start ${startYearMonth} end ${endYearMonth}`);
      wx.request({
        url: orderListUrl(),
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (orderListReqRes) {
          console.log('orderListReqRes: ', orderListReqRes)
          if (checkRespStatus(orderListReqRes, methodName)) {
            let ordersRaw = orderListReqRes.data;
            cb(ordersRaw);
          }

        },
        fail: err => requestFail(err, methodName)
      })
    },
    getSetting: (cb) => {
      let tokens = util.getStoredTokens();
      const methodName = "getSetting"
      console.log(`${methodName} got tokens: `, tokens);
      wx.request({
        url: customerSettingUrl(),
        method: "GET",
        header: util.getJsonReqHeader(tokens),
        success: function (customerSettingReqRes) {
          console.log('customerSettingReqRes: ', customerSettingReqRes)
          if (checkRespStatus(customerSettingReqRes, methodName)) {
            cb(customerSettingReqRes.data);
          }
          cb(customerSettingReqRes.data);
        },
        fail: err => requestFail(err, methodName)
      })
    },
    updateSetting: (customerSetting, cb) => {
      let tokens = util.getStoredTokens();
      const methodName = "updateSetting";
      console.log(`${methodName} got tokens: `, tokens);
      wx.request({
        url: customerUpdateSettingUrl(),
        method: "POST",
        data: customerSetting,
        header: util.postJsonReqHeader(tokens),
        success: function (resp) {
          console.log('customerUpdateSettingReqRes: ', resp)
          if (checkRespStatus(resp, methodName)) {
            let { success, msg, status } = parseResponseGeneral(resp);
            cb({ success, msg });
          }

        },
        fail: err => requestFail(err, methodName)
      })
    }
  },

  medprof: {
    getUpdateCustomerProfilePreReqData: (customerId, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      const methodName = "getUpdateCustomerProfilePreReqData";
      console.log(`${methodName} customerId: `, customerId);
      util.promisify(wx.request)
        ({
          url: medprofUpdateCustomerProfilePreReqUrl(),
          data: { customerId },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('getUpdateCustomerProfilePreReqData res: ', res)
          if (checkRespStatus(res, methodName)) {
            cb(res.data);
          }
        }).catch(function (reason) {
          //console.log('getUpdateCustomerProfilePreReqData failed, reason: ', reason);
          requestFail(reason, methodName);
        })

    },
    updateCustomerProfile: (req, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      const methodName = "medprof::updateCustomerProfile";
      console.log(`${methodName}: `, req);
      util.promisify(wx.request)
        ({
          url: medprofUpdateCustomerProfileUrl(),
          data: req,
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('updateCustomerProfile res: ', res);
          if (checkRespStatus(res, methodName)) {
            let success = res.statusCode == 200;
            let msg = res.data;
            cb({ success, msg });
          }

        }).catch(function (reason) {
          //console.log('updateCustomerProfile failed, reason: ', reason)
          requestFail(reason, methodName);
        })

    },

    getQRCodeList: medprofGetQRCodeList,
    getReffedCustomerInfos: medprofGetReffedCustomerInfos,
    getProfitStatsChartData: (startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      const methodName = "medprof::getProfitStatsChartData";
      console.log(`${methodName} start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);

      wx.request({
        url: medprofProfitStatsUrl(),
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (reqRes) {
          console.log('updateProfitStats res: ', reqRes)
          if (checkRespStatus(reqRes, methodName)) {
            cb(reqRes.data);
          }
        },
        fail: err => requestFail(err, methodName)
      })
    },
    getProfitStatsChartDataPerCustomer: medprofGetProfitStatsChartDataPerCustomer,
    getNewQrcodeData: (cb) => {
      let tokens = util.getStoredTokens();
      const methodName = "getNewQrcodeData";
      util.promisify(wx.request)
        ({
          url: newQrcodePreReqDataUrl(),
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('newQrcodePreReqData:', res);

          if (checkRespStatus(res, methodName)) {
            util.updateXAuth(res.header[util.xAuthHeader]);

            let products = res.data.products;
            // check all products by default
            products.forEach(function (prod) { prod.checked = true; });
            console.log("products: ", products);
            let pricePlans = res.data.pricePlans;
            console.log("pricePlans: ", pricePlans);

            cb({ products, pricePlans });
          }

        }).catch(function (reason) {
          requestFail(reason, methodName);
        })
    },
    saveNewQrcode: medprofSaveNewQrcode,
    getNewCustomerData: (cb) => {
      let tokens = util.getStoredTokens();
      const methodName = "getNewCustomerData";
      util.promisify(wx.request)
        ({
          url: newCustomerPreReqDataUrl(),
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('newCustomerPreReqData:', res);
          if (checkRespStatus(res, methodName)) {
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
          }
          //return res.data;
        }).catch(function (reason) {
          requestFail(reason, methodName);
        })
    },
    createNewCustomerAndProfile: (newCustomerReq, cb) => {
      // console.log('[to debug] createNewCustomerAndProfile:', newCustomerReq);
      const methodName = "createNewCustomerAndProfile";
      let tokens = util.getStoredTokens();
      util.promisify(wx.request)
        ({
          url: newCustomerAndProfileUrl(),
          method: 'POST',
          data: newCustomerReq,
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log(`${methodName}: `, res);
          if (checkRespStatus(res, methodName)) {
            util.updateXAuth(res.header[util.xAuthHeader]);
            // let success = res.statusCode == 200;
            // let msg = res.data;
            cb(res.data);
          }

        }).catch(function (reason) {
          requestFail(reason, methodName);
          //console.log('createNewCustomerAndProfile failed, reason: ', reason)
        })
    },
    getExistingCustomerData: function(cb) {
      const methodName = "getExistingCustomerData";
      // console.log('[todo] getExistingCustomerData')
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
      const methodName = "proforgagent:getMedProfs";

      wx.request({
        url: medprofListUrl(),
        method: "GET",
        header: util.postJsonReqHeader(tokens),
        success: function (medProfsRes) {
          console.log('medProfsRes: ', medProfsRes);
          if (checkRespStatus(medProfsRes, methodName)) {
            util.updateXAuth(medProfsRes.header[util.xAuthHeader]);
            cb(medProfsRes.data);
          }
        },
        fail: err => requestFail(err, "getMedProfs")
      })
    },
    getMedProfNewQrcodeData: (cb) => {
      let tokens = util.getStoredTokens();
      const methodName = "getMedProfNewQrcodeData";
      util.promisify(wx.request)
        ({
          url: newMedProfQrcodePreReqDataUrl(),
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('newQrcodePreReqData:', res);
          if (checkRespStatus(res, methodName)) {
            util.updateXAuth(res.header[util.xAuthHeader]);

            let rewardPlans = res.data.rewardPlans;
            console.log("rewardPlans: ", rewardPlans);

            cb({ rewardPlans });
          }

          //return res.data;
        }).catch(function (reason) {
          requestFail(reason, methodName);
          //console.log('createNewCustomerAndProfile failed, reason: ', reason)
        })
    },
    saveNewQrcode: proforgagentSaveNewQrcode,
    getCustomerQRCodeList: proforgagentGetCustomerQRCodeList,
    getMedProfQRCodeList: proforgagentGetMedProfQRCodeList,
    getReffedCustomerInfos: proforgagentGetReffedCustomerInfos,
    getProfitStatsChartDataPerCustomer: proforgagentGetProfitStatsChartDataPerCustomer,
    getProfitStatsChartData: (startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      const methodName = "orgagent::getProfitStatsChartData";
      console.log(`${methodName} start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);

      wx.request({
        url: proforgAgentprofitStatsUrl(),
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (reqRes) {
          console.log('orgagent::getProfitStatsChartData res: ', reqRes)
          if (checkRespStatus(reqRes, methodName)) {
            util.updateXAuth(reqRes.header[util.xAuthHeader]);
            cb(reqRes.data);
          }
        },
        fail: err => requestFail(err, "getProfitStatsChartData")
      })

    },
    getProfitStatsChartDataPerMedProf: (profId, startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      const methodName = "getProfitStatsChartDataPerMedProf";
      console.log(`${methodName} start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);
      util.promisify(wx.request)
        ({
          url: proforgAgentProfitStatsPerMedProfUrl(),
          data: { profId, startYearMonth, endYearMonth },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('ProfitStatsChartDataPerMedProf res: ', res)
          if (checkRespStatus(res, methodName)) {
            cb(res.data);
          }

        }).catch(function (reason) {
          requestFail(reason, methodName);
          //console.log('createNewCustomerAndProfile failed, reason: ', reason)
        })
    },
    getNewMedProfData: (cb) => {
      let tokens = util.getStoredTokens();
      const methodName = "getNewMedProfData";
      util.promisify(wx.request)
        ({
          url: newMedProfPreReqDataUrl(),
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('newMedProfPreReqData:', res);
          if (checkRespStatus(res, methodName)) {
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
          }


          //return res.data;
        }).catch(function (reason) {
          requestFail(reason, methodName);
          //console.log('createNewCustomerAndProfile failed, reason: ', reason)
        })
    },
    createNewMedProf: function(newMedProReq, cb) {
      let tokens = util.getStoredTokens();
      const methodName = "createNewMedProf";
      console.log(`${methodName}`, newMedProReq);
      util.promisify(wx.request)
        ({
          url: newMedProfUrl(),
          method: 'POST',
          data: newMedProReq,
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('createNewMedProf:', res);
          if (checkRespStatus(res, methodName)) {
            util.updateXAuth(res.header[util.xAuthHeader]);
            // let success = res.statusCode == 200;
            // let msg = res.data;
            cb(res.data);
          }

        })
        .catch(function (reason) {
          console.log('createNewMedProf failed, reason: ', reason)
        }).catch(function (reason) {
          requestFail(reason, methodName);
        })

    }
  },

  proforg: {
    getQRCodeList: proforgGetQRCodeList,
    saveNewQrcode: proforgSaveNewQrcode,
    getProfOrgAgentList: (cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      const methodName = "proforg:getProfOrgAgentList";

      wx.request({
        url: profOrgAgentListUrl(),
        method: "GET",
        header: util.postJsonReqHeader(tokens),
        success: function (agentListRes) {
          console.log('agentListRes: ', agentListRes)
          if (checkRespStatus(agentListRes, methodName)) {
            util.updateXAuth(agentListRes.header[util.xAuthHeader]);
            cb(agentListRes.data);
          }
        },
        fail: err => requestFail(err, "getProfOrgAgentList")
      })
    },

    getProfitStatsChartData: (startYearMonth, endYearMonth, cb) => {
      let that = this;
      let tokens = util.getStoredTokens();
      const methodName = "proforg::getProfitStatsChartData"
      console.log(`${methodName} start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);

      wx.request({
        url: profOrgProfitStatsUrl(),
        data: { startYearMonth, endYearMonth },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (reqRes) {
          console.log('orgagent::getProfitStatsChartData res: ', reqRes)
          if (checkRespStatus(reqRes, methodName)) {
            util.updateXAuth(reqRes.header[util.xAuthHeader]);
            cb(reqRes.data);
          }
        },
        fail: err => requestFail(err, "getProfitStatsChartData")
      })

    },

    getProfitStatsChartDataPerProfOrgAgent: (agentId, startYearMonth, endYearMonth, cb) => {
      let that = this;
      const methodName = "getProfitStatsChartDataPerProfOrgAgent";
      let tokens = util.getStoredTokens();
      console.log(`[proforg::getProfitStatsChartDataPerProfOrgAgent] start ${startYearMonth} end ${endYearMonth}, tokens:`, tokens);
      util.promisify(wx.request)
        ({
          url: profOrgProfitStatsPerProfOrgAgentUrl(),
          data: { agentId, startYearMonth, endYearMonth },
          method: "POST",
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('getProfitStatsChartDataPerProfOrgAgent res: ', res)
          if (checkRespStatus(res, methodName)) {
            cb(res.data);
          }

        }).catch(function (reason) {
          requestFail(reason, methodName);
        })
    },

    getNewProfOrgAgentData: function(cb) {
      let tokens = util.getStoredTokens();
      const methodName = "getNewProfOrgAgentData";
      util.promisify(wx.request)
        ({
          url: newProfOrgAgentPreReqDataUrl(),
          method: 'GET',
          header: util.getJsonReqHeader(tokens),
        }).then(res => {
          console.log('getNewProfOrgAgentData:', res);
          if (checkRespStatus(res, methodName)) {
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
          }

        }).catch(function (reason) {
          requestFail(reason, methodName);
        })
    },
    createNewProfOrgAgent: function (newProfOrgAgent, cb) {
      let tokens = util.getStoredTokens();
      const methodName = "createNewProfOrgAgent";
      console.log(`${methodName}`, newProfOrgAgent);
      util.promisify(wx.request)
        ({
          url: newProfOrgAgentUrl(),
          method: 'POST',
          data: newProfOrgAgent,
          header: util.postJsonReqHeader(tokens),
        }).then(res => {
          console.log('createNewProfOrgAgent:', res);
          if (checkRespStatus(res, methodName)) {
            util.updateXAuth(res.header[util.xAuthHeader]);
            // let success = res.statusCode == 200;
            // let msg = res.data;
            cb(res.data);
          }

        }).catch(function (reason) {
          requestFail(reason, methodName);
        })

    }
  }

};

module.exports = {
  datasrc: datasrc
};