// comp/register-comp.js
const registerUtil = require('../utils/register-util.js');

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

  },

  /**
   * Component methods
   */
  methods: {
    onRegister: function(e) {
      wx.scanCode({
        success(res) {
          console.log('Scan result: ', res);
          let r = registerUtil.parseJsonCustomer(res.result);
          console.log('Parsed result: ', r);
        }
      })
    }
  }
})
