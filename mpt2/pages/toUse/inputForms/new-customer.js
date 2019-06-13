// pages/toUse/inputForms/new-customer.js
const areaData = require('../../../utils/area.js')

Page({

  /**
   * Page initial data
   */
  data: {
    userid: 'newcustomer01',
    password: '123',
    password2: '123',
    userName: '张某',
    idCardNo: '310112197003113821',
    mobile: '13700011100',
    postAddr: '某省某市某区某路xx号 邮编102011',
    areaList: areaData.default
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },
  onInputUserId: function (e) {
    this.setData({ userid: e.detail })
  },
  onInputPassword: function (e) {
    this.setData({ password: e.detail })
  },
  onInputPassword2: function (e) {
    this.setData({ password2: e.detail })
  },
  onInputUserName: function (e) {
    this.setData({ userName: e.detail })
  },
  onInputIdCardNo: function (e) {
    this.setData({ idCardNo: e.detail })
  },
  onInputMobile: function (e) {
    this.setData({ mobile: e.detail })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})