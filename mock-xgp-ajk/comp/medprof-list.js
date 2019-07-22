// comp/medprof-list.js
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
    }
  }
})
