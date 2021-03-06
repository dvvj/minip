// pages/vant-test/vt3.js
import Toast from '../../vant-lib/toast/toast';
const areaList = require('../../utils/area.js')

Page({

  /**
   * Page initial data
   */
  data: {
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    activeNames: ['2'],
    title: '请选择省市区',
    areaList: areaList.default
  },
  onChange(event) {
    console.log(event)
    const { picker, value, index } = event.detail;

    //Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onConfirm: function(e) {
    console.log('confirmed: ', e);
    let selected = e.detail.values.map(v => v.name).join('-');
    this.setData({ title: selected});
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(this.data.areaList)
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