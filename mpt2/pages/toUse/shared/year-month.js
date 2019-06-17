// pages/toUse/shared/year-month.js
import Dialog from '../../../vant-lib/dialog/dialog';

Page({

  /**
   * Page initial data
   */
  data: {
    startYearMonth: '2018-10',
    endYearMonth: '2019-03',
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },
  onYearMonthPickerConfirm(event) {
    console.log('e: ', event)
    let date = new Date(event.detail)
    let t = {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }
    console.log('t: ', t)
    this.setData({
      currentDate: event.detail //.value
    });

    if (this.data.dlgType == 'start')
      this.updateStartYearMonth(date);
    else
      this.updateEndYearMonth(date);
    Dialog.close();
  },
  fixMonth: function(monthIndex) {
    let monthVal = monthIndex + 1
    if (monthVal < 10)
      return '0'+monthVal;
    else
      return ''+monthVal;
  },
  updateStartYearMonth: function(setDate) {
    let yearMonth = `${setDate.getFullYear()}-${this.fixMonth(setDate.getMonth())}`;
    console.log('new startYearMonth: ', yearMonth)
    this.setData({ startYearMonth: yearMonth })
  },
  updateEndYearMonth: function (setDate) {
    let yearMonth = `${setDate.getFullYear()}-${this.fixMonth(setDate.getMonth())}`;
    console.log('new endYearMonth: ', yearMonth)
    this.setData({ endYearMonth: yearMonth })
  },
  showDialog: function(title, dlgType) {
    this.setData({ dlgType: dlgType });
    Dialog.alert({
      title: title,
      showConfirmButton: false,
      showCancelButton: false
    }).then(() => {
      // on close
    }).catch(reason => console.log('cancelled: ', reason));
  },
  onSetStartYearMonth: function(e) {
    this.showDialog('设置起始年月', 'start')
  },
  onSetEndYearMonth: function (e) {
    this.showDialog('设置终止年月', 'end')
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