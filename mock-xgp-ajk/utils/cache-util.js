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
  //return retrieveStorage(k, true); 
  return retrieveStorage(k, false); 
};
const saveProfitStatsPerMedProf = function (data) {
  let k = profitStatsKey(util.profitStatsByMedProfChartDataKey);
  wx.setStorageSync(k, data);
};
const getProfitStatsPerMedProf = function () {
  let k = profitStatsKey(util.profitStatsByMedProfChartDataKey);
  return retrieveStorage(k, false); 
};
const saveProfitStatsPerProfOrgAgent = function (data) {
  let k = profitStatsKey(util.profitStatsByProfOrgAgentChartDataKey);
  wx.setStorageSync(k, data);
};
const getProfitStatsPerProfOrgAgent = function () {
  let k = profitStatsKey(util.profitStatsByProfOrgAgentChartDataKey);
  return retrieveStorage(k, false);
};

const customerProfileKey = function () {
  return `${appKeyPrefix}.${util.getUserId()}.currCustomerProfile`;
};
const saveCurrCustomerProfile = function (customerProfile) {
  let k = customerProfileKey();
  wx.setStorageSync(k, customerProfile);
};
const getCurrCustomerProfile = function () {
  let k = customerProfileKey();
  return retrieveStorage(k, false);
};

const updatedCustomerProfileKey = function() {
  return `${appKeyPrefix}.${util.getUserId()}.updatedCustomerProfile`;
};
const saveUpdatedCustomerProfile = function (customerProfile) {
  let k = updatedCustomerProfileKey();
  wx.setStorageSync(k, customerProfile);
};
const getUpdatedCustomerProfile = function () {
  let k = updatedCustomerProfileKey();
  return retrieveStorage(k, true);
};

const currQrcodeKey = function() {
  return `${appKeyPrefix}.${util.getUserId()}.currQrcode`;
};
const saveSelectedQrcode = function(qrcode) {
  let k = currQrcodeKey();
  wx.setStorageSync(k, qrcode);
};
const getSelectedQrcode = function () {
  let k = currQrcodeKey();
  return retrieveStorage(k, true);
};
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
  saveCurrCustomerProfile,
  getCurrCustomerProfile,
  saveUpdatedCustomerProfile,
  getUpdatedCustomerProfile,
  saveSelectedQrcode,
  getSelectedQrcode,
  clearCache4Demo
};