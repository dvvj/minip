// comp/proforgagent-list.js
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
    }
  }
})