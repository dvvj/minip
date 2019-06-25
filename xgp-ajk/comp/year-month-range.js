// comp/year-month-range.js

Component({
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log('in attached: ', this.data.end);
      var endDate;
      if (this.data.end == null) {
        endDate = new Date();
      }
      else {
        let parts = this.data.end.split("-");
        console.log('parts: ', parts);
        let year = parseInt(parts[0]);
        let month = parseInt(parts[1])-1;
        endDate = new Date(year, month, 1);
      }

      var startDate;
      if (this.data.start == null) {
        var startMonth = endDate.getMonth() - 5; // 6 months in total
        var startYear = endDate.getFullYear();
        if (startMonth <= 0) {
          startYear -= 1;
          startMonth += 12;
        }
        startDate = new Date(startYear, startMonth, 1);
      }
      else {
        let parts = this.data.start.split("-");
        console.log('parts: ', parts);
        let year = parseInt(parts[0]);
        let month = parseInt(parts[1])-1;
        startDate = new Date(year, month, 1);
      }

      let _startYM = { year: startDate.getFullYear(), month: startDate.getMonth() + 1 }
      let _endYM = { year: endDate.getFullYear(), month: endDate.getMonth() + 1 }
      this.setData(
        {
          _startYM, _endYM,
          startDate: startDate.getTime(),
          endDate: endDate.getTime()
        }
      );
    },
  },
  /**
   * Component properties
   */
  properties: {
    start: {
      type: String,
      value: null
    },
    end: {
      type: String,
      value: null
    }
  },

  /**
   * Component initial data
   */
  data: {
    activeTabIndex: 0,
    // start: {
    //   year: 2018, // will be replaced
    //   month: 9
    // },
    // end: {
    //   year: 2019,
    //   month: 2
    // },

    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },

  /**
   * Component methods
   */
  methods: {
    onConfirm: function (e) {
      console.log('onMonthPickerConfirm', e)
      let date = new Date(e.detail)
      let ym = { year: date.getFullYear(), month: date.getMonth() + 1 }
      if (this.data.activeTabIndex == 0) {
        this.setData({ startDate: date.getTime(), _startYM: ym });
      }
      else {
        this.setData({ endDate: date.getTime(), _endYM: ym });
      }
    },
    onChangeTab: function (e) {
      let newIndex = e.detail.index;
      this.setData({ activeTabIndex: newIndex })
    },
    getSelection: function () {
      return {
        start: this.data._startYM,
        end: this.data._endYM
      };
    }
  }
})
