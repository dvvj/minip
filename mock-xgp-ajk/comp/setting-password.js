// comp/setting-password.js
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
    userPassInfo: { }
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (userPassInfo) {
      this.setData({ userPassInfo });
    }
  }
})
