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

let saveTokens = function (xAuthToken, accessToken) {
  wx.setStorage({
    key: "tokens",
    data: { xauth: xAuthToken, accessToken },
    success: function (res) {
      console.log("tokens saved: ", res)
    },
    fail: function (err) {
      console.log("failed to save tokens: ", err)
    }
  })
}

const webappBase = 'https://webapp.wonder4.life:8443';
const loginUrl = webappBase + '/wxlogin';
const imgBaseUrl = webappBase + '/product';
const xAuthHeader = 'X-Auth-Token';

module.exports = {
  formatTime: formatTime,
  promisify: promisify,
  webappBase: webappBase,
  loginUrl: loginUrl,
  imgBaseUrl: imgBaseUrl,
  saveTokens: saveTokens,
  xAuthHeader: xAuthHeader
}
