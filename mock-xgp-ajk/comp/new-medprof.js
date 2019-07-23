// comp/new-medprof.js
import Toast from '../vant-lib/toast/toast';
const util = require('../utils/util.js');
const inputCheck = require('../utils/input-check.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;

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
    newMedProf: {},
    errorMsgs: {}
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (newMedProfData) {
      console.log('newMedProfData', newMedProfData);
      let { newMedProf, rewardPlans } = newMedProfData;
      this.setData({
        newMedProf, rewardPlans
      });
    },

  }
})
