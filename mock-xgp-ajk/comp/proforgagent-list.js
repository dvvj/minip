// comp/proforgagent-list.js
const util = require('../utils/util.js');

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    proforgagents: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (proforgagents) {
      this.setData({ proforgagents });
    },
    onAddNewProfOrgAgentClicked: function() {
      console.log('onAddNewProfOrgAgentClicked, triggering event gotoAddNewProfOrgAgent');
      this.triggerEvent('gotoAddNewProfOrgAgent');
    },

    onClick: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currAgent = this.data.proforgagents[idx];
      console.log('proforgagents', currAgent);
      wx.setStorageSync(util.currAgentKey, currAgent)
    }
  }
})
