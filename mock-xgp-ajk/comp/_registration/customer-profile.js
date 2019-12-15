// comp/customer-profile.js
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
    profile: {
      healthTags: 'healthTags',
      medicineTags: 'medicineTags'
    },
    products: [
      { id: 1, name: 'name1', enabled: true, checked: false },
      { id: 2, name: 'name2', enabled: true, checked: false },
      { id: 3, name: 'name3', enabled: false, checked: true }
    ],
    selected: [
      { id: 2, name: 'name2', enabled: true, checked: false },
      { id: 3, name: 'name3', enabled: false, checked: true }
    ]
  },

  /**
   * Component methods
   */
  methods: {
    onChange(event) {
      console.log(event)
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
    },
    onClick(event) {
      const { value } = event.currentTarget.dataset;
      this.setData({
        radio3: value
      });
    },
    toggle(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },
    noop() { }
  }
})
