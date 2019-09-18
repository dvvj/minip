// comp/switch-user.js
const util = require('../utils/util.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;

const userTypeTextMap = {
  "c-": "客户",
  "p-": "营养师",
  "a-": "业务员",
  "o-": "医药公司"
};

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
    show: false,
    userInfos: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (allUids) {
      const currUid = util.getUserId();
      let altUids = allUids.filter(uid => uid !== currUid);
      console.log(currUid, altUids, allUids);
      const userInfos = altUids.map(uid => {
        let ui = { uid };
        ui.userType = uid;
        const pfx = uid.substring(0, 2);
        ui.userTypeText = userTypeTextMap[pfx];
        return ui;
      });
      this.setData({userInfos});
    },

    onSelectUser: function(e) {
      const index = e.currentTarget.dataset.index;
      const uid = this.data.userInfos[index].uid;
      console.log('onSelectUser: ', index, uid, e);

      datasrc.switchUserToLoginPage(uid);
    },

    _show: function(toShow) {
      this.setData({ show: toShow});
    },

    show: function() {
      this._show(true);
    },

    hide: function() {
      this._show(false);
    },

    onClose: function(e) {
      this.hide();
    }
  }
})
