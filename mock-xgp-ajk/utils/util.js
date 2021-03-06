const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const base64DecAscii = function (buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const getStoredTokens = function() {
  return wx.getStorageSync(userTokenKey);
};

const getAltUids = function () {
  return getStoredTokens().mobileUids;
};

const getYearMonthOfLastN = function (numOfMonth) {
  let endDate = new Date();
  var startMonth = endDate.getMonth() - numOfMonth+1; // 6 months in total
  var startYear = endDate.getFullYear();
  if (startMonth <= 0) {
    startYear -= 1;
    startMonth += 12;
  }
  let startDate = new Date(startYear, startMonth, 1);
  let _startYM = { year: startDate.getFullYear(), month: startDate.getMonth() + 1 };
  let _endYM = { year: endDate.getFullYear(), month: endDate.getMonth() + 1 };
  return { _startYM, _endYM };
};

const getYearMonthDefault = function() {
  return getYearMonthOfLastN(6);
};

const getYearMonthDefaultByProd = function () {
  return getYearMonthOfLastN(3);
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const postJsonReqHeader = (tokens) => {
  let res = { }
  res['content-type'] = 'application/json';
  res['Authorization'] = 'Bearer ' + tokens.accessToken;
  res['X-Auth-Token'] = tokens.xauth
  return res;
}

const getJsonReqHeader = (tokens) => {
  let res = {}
  res['Authorization'] = 'Bearer ' + tokens.accessToken;
  res['X-Auth-Token'] = tokens.xauth
  return res;
}

const promisify = original => {
  return function (opt) {
    return new Promise((resolve, reject) => {
      opt = Object.assign({
        success: resolve,
        fail: reject
      }, opt)
      original(opt)
    })
  }
};

const userTokenKey = "userTokens"
const userIdKey = "userId"
const currOrderKey = "currOrder";
const currAgentKey = "currAgent";
const currMedProfKey = "currMedProf";
const currCustomerKey = "currCustomer";
const currProductKey = "currProduct";
const currQrcodeDataKey = "currQrcodeData";
const newlyAddedQrcodesKey = "newlyAddedQrcodes";
const profitStatsByCustomerChartDataKey = "profitStatsByCustomerChartData";
const profitStatsByMedProfChartDataKey = "profitStatsByMedProfChartData";
const profitStatsByProfOrgAgentChartDataKey = "profitStatsByProfOrgAgentChartData";

const getUserId = () => {
  return wx.getStorageSync(userIdKey);
};

let saveTokens = function (evt) {

  const xAuthToken = evt.header[xAuthHeader];
  const accessToken = evt.data.oauth2.access_token;
  const userType = evt.data.userType;
  const mobileUids = evt.data.mobileUids;

  _saveTokens(xAuthToken, accessToken, userType, mobileUids);
}

let _saveTokens = function (xAuthToken, accessToken, userType, mobileUids) {
  const altUids = mobileUids ? mobileUids : [];
  if (typeof xAuthToken === 'undefined') {
    console.log('X-Auth-Token not updated, skip saving...')
  }
  else {
    wx.setStorage({
      key: userTokenKey,
      data: { xauth: xAuthToken, accessToken, userType, mobileUids: altUids },
      success: function (res) {
        console.log("tokens saved: ", res)
      },
      fail: function (err) {
        console.log("failed to save tokens: ", err)
      }
    })
    console.log('tokens saved:', xAuthToken, accessToken)
  }
}

let updateXAuth = function(xauth) {
  let tmp = getStoredTokens();
  _saveTokens(xauth, tmp.accessToken, tmp.userType, tmp.mobileUids);
}

let roundPrice = function (price) {
  var p100 = Math.round(price * 100)
  return p100 / 100.0;
};

let roundPriceArr = function (arr) {
  return arr.map(i => roundPrice(i))
};

//var _webappBase = 'https://webapp.ajkhealth.com';
var _webappBase = 'https://webapp.wonder4.life';

const setWebappBase = function (newWebappBase) {
  _webappBase = newWebappBase;
};
const getWebappBase = function() {
  return _webappBase;
};

//const webappBase = 'https://webapp.wonder4.life';
//const webappBase = 'https://47.98.232.21:8443';
//const webappBase = 'https://webapp.ajkhealth.com';
const getLoginUrl = function() {
  return getWebappBase() + '/wxlogin'
};
const getImgBaseUrl = function() {
  return getWebappBase() + '/product';
};

const getCustomerBaseUrl = function() {
  return getWebappBase() + '/customer';
};
const getMedprofBaseUrl = function() {
  return getWebappBase() + '/medprof'; 
};
const getProforgagentBaseUrl = function() {
  return getWebappBase() + '/proforgagent';
};
const getProforgBaseUrl = function() {
  return getWebappBase() + '/proforg'; 
};
const getRegistrationBaseUrl = function() {
  return getWebappBase() + '/register';
};
const wePayezUrl = function () {
  return getWebappBase() + '/wx/wepayezReq';
};
const wxpayReqUrl = function () {
  return getWebappBase() + '/wx/wxpayReq';
};
const xAuthHeader = 'X-Auth-Token';

const wepayezReqTempl = "https://gateway.wepayez.com/pay/jsIntl?token_id=";
const wepayezReqUrl = function(token_id) {
  return wepayezReqTempl + token_id
};
const wepayezUrlKey = "wepayezUrlKey";
const setWePayezUrl = function(token_id) {
  let url = wepayezReqTempl + token_id;
  wx.setStorageSync(wepayezUrlKey, url)
};
const getWePayezUrl = function() {
  return wx.getStorageSync(wepayezUrlKey);
}

const prodPagesBase = '/pages/prod';
const userType2MainPage = {
  Customer: prodPagesBase + '/customer/customer_main',
  MedProf: prodPagesBase + '/medprof/medprof_main',
  ProfOrgAgent: prodPagesBase + '/orgagent/orgagent_main',
  ProfOrg: prodPagesBase + '/proforg/proforg_main',
};

const getMainPage = function(userType) {
  return userType2MainPage[userType];
};

const requestWePayez = function(tokenId, tokens) {
  let payUrl = wepayezReqTempl + tokenId;
  wx.request({
    url: payUrl,
    method: "GET",
    header: postJsonReqHeader(tokens),
    success: function (r2) {
      console.log('[requestWePayez] WePayez pay url: ', payUrl)
    },
    fail: function (e2) {
      console.info("e2: ", e2)
    }
  })
};

const wxCharts = require('wxcharts-min.js');
const createChart = function (chartData) {
  return new wxCharts({
    canvasId: 'columnCanvas',
    type: 'column',
    categories: chartData.yearMonths,
    series: [{
      name: '销售额',
      data: roundPriceArr(chartData.sales)
    }, {
      name: '佣金',
      data: roundPriceArr(chartData.rewards)
    }],
    yAxis: {
      title: '总金额（￥）',
      format: function (val) {
        return val.toFixed(2);
      },
      min: 0,
    },
    width: 360,
    height: 360
  });
};

module.exports = {
  base64DecAscii: base64DecAscii,
  createChart: createChart,
  formatTime: formatTime,
  promisify: promisify,
  //webappBase: webappBase,
  getWebappBase,
  setWebappBase,

  getLoginUrl,
  getImgBaseUrl,
  getCustomerBaseUrl,
  getMedprofBaseUrl,
  getProforgagentBaseUrl,
  getProforgBaseUrl,
  getRegistrationBaseUrl,
  wePayezUrl,
  wxpayReqUrl,

  //customerBaseUrl: customerBaseUrl,
  //medprofBaseUrl: medprofBaseUrl,
  //proforgagentBaseUrl: proforgagentBaseUrl,
  //proforgBaseUrl: proforgBaseUrl,
  //registrationBaseUrl: registrationBaseUrl,
  //loginUrl: loginUrl,
  //imgBaseUrl: imgBaseUrl,
  saveTokens: saveTokens,
  xAuthHeader: xAuthHeader,
  roundPrice: roundPrice,
  roundPriceArr: roundPriceArr,
  getStoredTokens: getStoredTokens,
  userIdKey: userIdKey,
  getUserId: getUserId,
  getAltUids: getAltUids,
  currOrderKey: currOrderKey,
  currAgentKey: currAgentKey,
  currMedProfKey: currMedProfKey,
  currCustomerKey: currCustomerKey,
  currProductKey: currProductKey,
  currQrcodeDataKey: currQrcodeDataKey,
  newlyAddedQrcodesKey: newlyAddedQrcodesKey,
  profitStatsByCustomerChartDataKey: profitStatsByCustomerChartDataKey,
  profitStatsByMedProfChartDataKey: profitStatsByMedProfChartDataKey,
  profitStatsByProfOrgAgentChartDataKey: profitStatsByProfOrgAgentChartDataKey,
  updateXAuth: updateXAuth,
  getMainPage: getMainPage,
  postJsonReqHeader: postJsonReqHeader,
  getJsonReqHeader: getJsonReqHeader,
  getYearMonthDefault: getYearMonthDefault,
  getYearMonthDefaultByProd: getYearMonthDefaultByProd,
  setWePayezUrl: setWePayezUrl,
  getWePayezUrl: getWePayezUrl,
  requestWePayez, requestWePayez,
  datasrc: 'datasrc',
  version: '0.7.1.AJK'
}
