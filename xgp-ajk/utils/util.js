const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

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

let saveTokens = function (evt) {

  let xAuthToken = evt.header[xAuthHeader];
  let accessToken = evt.data.oauth2.access_token;
  let userType = evt.data.userType;

  _saveTokens(xAuthToken, accessToken, userType);
}

let _saveTokens = function (xAuthToken, accessToken, userType) {
  if (typeof xAuthToken === 'undefined') {
    console.log('X-Auth-Token not updated, skip saving...')
  }
  else {
    wx.setStorage({
      key: userTokenKey,
      data: { xauth: xAuthToken, accessToken, userType },
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
  let tmp = wx.getStorageSync(userTokenKey)
  _saveTokens(xauth, tmp.accessToken, tmp.userType);
}

let roundPrice = function (price) {
  var p100 = Math.round(price * 100)
  return p100 / 100.0;
};

let roundPriceArr = function (arr) {
  return arr.map(i => roundPrice(i))
};

const webappBase = 'https://webapp.wonder4.life';
//const webappBase = 'https://47.98.232.21:8443';
//const webappBase = 'https://webapp.ajkhealth.com';
const loginUrl = webappBase + '/wxlogin';
const imgBaseUrl = webappBase + '/product';
const customerBaseUrl = webappBase + '/customer';
const medprofBaseUrl = webappBase + '/medprof';
const xAuthHeader = 'X-Auth-Token';

const prodPagesBase = '/pages/prod';
const userType2MainPage = {
  Customer: prodPagesBase + '/customer/customer_main',
  MedProf: prodPagesBase + '/medprof/medprof_main',
  ProfOrg: prodPagesBase + '/proforg/proforg_main',
};

const getMainPage = function(userType) {
  return userType2MainPage[userType];
}

module.exports = {
  formatTime: formatTime,
  promisify: promisify,
  webappBase: webappBase,
  customerBaseUrl: customerBaseUrl,
  medprofBaseUrl: medprofBaseUrl,
  loginUrl: loginUrl,
  imgBaseUrl: imgBaseUrl,
  saveTokens: saveTokens,
  xAuthHeader: xAuthHeader,
  roundPrice: roundPrice,
  roundPriceArr: roundPriceArr,
  userTokenKey: userTokenKey,
  updateXAuth: updateXAuth,
  getMainPage: getMainPage,
  postJsonReqHeader: postJsonReqHeader,
  getJsonReqHeader: getJsonReqHeader
}
