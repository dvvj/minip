const appKeyPrefix = "_w4l";
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
}
const getCachedProductList = function (uid) {
  return wx.getStorageSync(productListKey(uid));
};
const saveCachedProductList = function(uid, products) {
  wx.setStorageSync(productListKey(uid), products);
  console.log(`product list cached, #: ${products.length}`);
}
// const productDictKey = appKeyPrefix + ".productDict";
// const getCachedProductDict = function () {
//   return wx.getStorageSync(productDictKey);
// };
// const saveCachedProductDict = function () {
//   return wx.getStorageSync(productDictKey);
// };

module.exports = {
  getImgKey,
  getCachedImgPath,
  getCachedProductList,
  saveCachedProductList
};