const util = require('util.js');

const appKeyPrefix = "_w4l" + util.version;
const appImgKeyPrefix = appKeyPrefix + ".img";

const getImgKey = function(prodId, isThumb) {
  // _w4l.1.thumb
  var k = `${appImgKeyPrefix}.${prodId}`;
  if (isThumb) return k+'.thumb';
  else return k;
};
const getCachedImgPath = function (prodId, isThumb) {
  return wx.getStorageSync(getImgKey(prodId, isThumb));
};

const productListKey = function(uid) {
  return `${appKeyPrefix}.${uid}.products`;
};

const getCachedProductList = function (uid) {
  let cacheKey = productListKey(uid);
  console.log('product list cache key: ', cacheKey);
  return wx.getStorageSync(productListKey(uid));
};
const saveCachedProductList = function(uid, products) {
  wx.setStorageSync(productListKey(uid), products);
  console.log(`product list cached, #: ${products.length}`);
};

const retrieveStorage = function(key, remove) {
  let res = wx.getStorageSync(key);
  if (remove) {
    wx.removeStorageSync(key);
  }
  return res;
};

const profitStatsKey = function(key) {
  return `${appKeyPrefix}.${util.getUserId()}.${key}`;
};
const saveProfitStatsPerCustomer = function(data) {
  let k = profitStatsKey(util.profitStatsByCustomerChartDataKey);
  wx.setStorageSync(k, data);
};
const getProfitStatsPerCustomer = function() {
  let k = profitStatsKey(util.profitStatsByCustomerChartDataKey);
  return retrieveStorage(k, true); 
};
const saveProfitStatsPerMedProf = function (data) {
  let k = profitStatsKey(util.profitStatsByMedProfChartDataKey);
  wx.setStorageSync(k, data);
};
const getProfitStatsPerMedProf = function () {
  let k = profitStatsKey(util.profitStatsByMedProfChartDataKey);
  return retrieveStorage(k, true);
};
const saveProfitStatsPerProfOrgAgent = function (data) {
  let k = profitStatsKey(util.profitStatsByProfOrgAgentChartDataKey);
  wx.setStorageSync(k, data);
};
const getProfitStatsPerProfOrgAgent = function () {
  let k = profitStatsKey(util.profitStatsByProfOrgAgentChartDataKey);
  return retrieveStorage(k, true);
}

// const productDictKey = appKeyPrefix + ".productDict";
// const getCachedProductDict = function () {
//   return wx.getStorageSync(productDictKey);
// };
// const saveCachedProductDict = function () {
//   return wx.getStorageSync(productDictKey);
// };

const clearCache4Demo = function() {
  let keys = ['c-c', 'c-c1', 'c-c2', 'c-c3', 'c-cc', 'c-ccc', 'c-bbb'];
  keys.forEach(function(k) {
    let key = `_w4l.${k}.products`;
    console.log('removing key: ', key);
    wx.removeStorageSync(key);
  })
};

module.exports = {
  getImgKey,
  getCachedImgPath,
  getCachedProductList,
  saveCachedProductList,
  retrieveStorage,
  saveProfitStatsPerCustomer,
  getProfitStatsPerCustomer,
  saveProfitStatsPerMedProf,
  getProfitStatsPerMedProf,
  saveProfitStatsPerProfOrgAgent,
  getProfitStatsPerProfOrgAgent,
  clearCache4Demo
};