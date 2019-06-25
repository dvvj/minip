// comp/year-month-range.js

Component({
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log('in attached')
      let endDate = new Date();
      let end = {
        year: endDate.getFullYear(),
        month: endDate.getMonth()+1
      };
      var startMonth = endDate.getMonth() - 8;
      var startYear = endDate.getFullYear();
      if (startMonth <= 0) {
        startYear -= 1;
        startMonth += 12;
      }
      let startDate = new Date(startYear, startMonth, 1);
      let start = {
        year: startDate.getFullYear(),
        month: startDate.getMonth()
      };

      console.log('start: ', start);
      console.log('end: ', end);
      this.setData(
        {
          start, end,
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

  },

  /**
   * Component initial data
   */
  data: {
    activeTabIndex: 0,
    start: {
      year: 2018, // will be replaced
      month: 9
    },
    end: {
      year: 2019,
      month: 2
    },

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
      let t = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
      let res = { year: t.year, month: t.month }

      let t2 = {
        ...this.data,
      };
      if (this.data.activeTabIndex == 0) {
        let start = res;
        t2['start'] = start;
      }
      else {
        let end = res;
        t2['end'] = res;
      }
      this.setData(t2);
    },
    onChangeTab: function (e) {
      let newIndex = e.detail.index;
      this.setData({ activeTabIndex: newIndex })
    },
    getSelection: function () {
      return { start: this.data.start, end: this.data.end };
    }
  }
})
