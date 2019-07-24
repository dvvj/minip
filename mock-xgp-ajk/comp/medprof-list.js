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
    },

    onAddNewMedProfClicked: function(e) {
      console.log('onAddNewMedProfClicked, triggering event gotoAddNewMedProf');
      this.triggerEvent('gotoAddNewMedProf');
    }
  }
})
