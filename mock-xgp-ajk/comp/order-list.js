// comp/order-list.js
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
    orderList: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(orderList) {
      this.setData({orderList})
    }
  }
})
