// comp/switch-user.js
const util = require('../utils/util.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;

const userTypeTextMap = {
  Customer: "客户",
  MedProf: "营养师",
  ProfOrgAgent: "业务员",
  ProfOrg: "医药公司"
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
    userInfos: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(userInfos) {
      userInfos.forEach(ui => {
        ui.userTypeText = userTypeTextMap[ui.userType];
      });
      this.setData({userInfos});
    },

    onSelectUser: function(e) {
      const index = e.currentTarget.dataset.index;
      const uid = this.data.userInfos[index].uid;
      console.log('onSelectUser: ', index, uid, e);

      datasrc.switchUserToLoginPage(uid);
    }
  }
})
