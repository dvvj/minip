// comp/medprof-list.js
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
    medprofs: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (medprofs) {
      this.setData({ medprofs });
    },

    onAddNewMedProfClicked: function(e) {
      console.log('onAddNewMedProfClicked, triggering event gotoAddNewMedProf');
      this.triggerEvent('gotoAddNewMedProf');
    },

    onClick: function (e) {
      let idx = e.currentTarget.dataset.index;
      let currMedProf = this.data.medprofs[idx];
      console.log('medprofs', currMedProf);
      wx.setStorageSync(util.currMedProfKey, currMedProf)
    }
  }
})
