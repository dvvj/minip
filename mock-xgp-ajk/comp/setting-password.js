// comp/setting-password.js
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
    altUids: [],
    userPassInfo: { }
  },

  /**
   * Component methods
   */
  methods: {
    getSwitchUserComp: function() {
      return this.selectComponent("#switchUser");
    },
    initData: function (userPassInfo) {
      const altUids = util.getAltUids();

      this.setData({ userPassInfo, altUids });
      const su = this.getSwitchUserComp();
      if (altUids.length > 0) {
        // const userInfos = altUids.map(uid => { return { uid, userType: 'Customer' } });
        // console.log('altUids: ', altUids, userInfos);
        su.initData(altUids);
      }
    },
    onSwitchUser: function(e) {
      const su = this.getSwitchUserComp();
      su.show();
    }
  }
})
