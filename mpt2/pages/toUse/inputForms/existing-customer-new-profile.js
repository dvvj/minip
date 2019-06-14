// pages/toUse/inputForms/existing-customer-new-profile.js
Page({

  /**
   * Page initial data
   */
  data: {
    userid: '', //'newcustomer01',
    userName: '张某',
    idCardNo: '', //'310112197003113821',
    mobile: '', // '13700011100',
    healthTags: '高血压，糖尿病',
    medicineTags: '降压药'
  },

  onInputUserId: function (e) {
    this.setData({ userid: e.detail })
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
  onInputPostAddr: function (e) {
    this.setData({ postAddr: e.detail })
  },
  onInputHealthTags: function (e) {
    this.setData({ healthTags: e.detail })
  },
  onInputMedicineTags: function (e) {
    this.setData({ medicineTags: e.detail })
  },
  onFindCustomer: function (e) {
    console.log('todo: search customer', e);
    let that = this;
    that.setData( {
      userid: 'ne*01',
      userName: '张**',
      idCardNo: '310***816', //'310112197003113821',
      mobile: '137***139', // '13700011100',
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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