// comp/popup/popup.js
Component({
  options: {
    multiSlots: true
  },
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: '[title]'
    },
    content: {
      type: String,
      value: '[content]'
    }
  },

  /**
   * Component initial data
   */
  data: {
    flat: true
  },

  /**
   * Component methods
   */
  methods: {
    hide: function() {
      console.log('in hide');
      this.setData({
        flag: true
      })
    },
    show: function() {
      this.setData({
        flag: false
      })
    },
    _confirm: function() {
      this.triggerEvent("confirm")
    }
  }
})
