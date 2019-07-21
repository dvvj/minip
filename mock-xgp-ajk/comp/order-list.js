// comp/order-list.js
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
    orderList: []
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(orderList) {
      console.log(orderList);
      this.setData({orderList})
    },

    onClick: function(e) {
      let idx = e.currentTarget.dataset.index;
      let currOrder = this.data.orderList[idx];
      console.log('currOrder', currOrder);
      wx.setStorageSync(util.currOrderKey, currOrder)
    }
  }
})
