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

const productListKey = appKeyPrefix + ".products";
const getCachedProductList = function() {
  return wx.getStorageSync(productListKey);
};
const saveCachedProductList = function(products) {
  wx.setStorageSync(productListKey, products);
  console.log(`product list cached, #: ${product.length}`);
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