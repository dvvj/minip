// pages/prod/orgagent/orgagent_main.js
const util = require('../../../utils/util.js');
const echartData = require('../../../utils/echart-data.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;

const tabIndices = {
  medprofInfos: 0,
  profitStats: 1,
  newMedProf: 2,
  setting: 3
};

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0,

  },
  onTabbarChange: function (e) {
    console.log(e)
    let tabIndex = e.detail
    this.updateActiveTab(tabIndex)
  },
  updateActiveTab: function (tabIndex) {
    this.updateTabContent(tabIndex);
    this.setData({ activeTabIndex: tabIndex });
  },

  updateTabContent: function (tabIndex) {

    if (tabIndex == tabIndices.medprofInfos) {
      this.updateMedProfs();
    }
    else if (tabIndex == tabIndices.profitStats) {
      // todo: cache data
      this.updateProfitStats();
    }
    else if (tabIndex == tabIndices.newMedProf) {
      this.updateNewMedProf();
    }
    else if (tabIndex == tabIndices.setting) {
      this.updateSetting();
    }
  },

  updateMedProfs: function () {
    let that = this;
    console.log('in updateMedProfs');
    datasrc.orgagent.getMedProfs(
      medprofs => {
        console.log('in updateMedProfs, ', medprofs);
        let medprofList = that.selectComponent("#medprofList");
        medprofList.initData(medprofs)
      }
    );
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.updateActiveTab(this.data.activeTabIndex);
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