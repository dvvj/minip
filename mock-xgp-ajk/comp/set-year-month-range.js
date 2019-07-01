// comp/set-year-month-range.js
import Dialog from '../vant-lib/dialog/dialog';

Component({
  lifetimes: {
    attached: function () {
      this.onAttached();
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
    _parseYM: function (y_m) {
      let parts = y_m.split("-");
      console.log('parts: ', parts);
      let year = parseInt(parts[0]);
      let month = parseInt(parts[1]);
      return { year, month };
    },
    setEnd: function (y_m) {
      var endDate;
      if (y_m == null) {
        endDate = new Date();
      }
      else {
        let { year, month } = this._parseYM(y_m);
        endDate = new Date(year, month - 1, 1);
      }
      let _endYM = {
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1
      };
      this.setData({
        _endYM,
        endDate: endDate.getTime()
      })
    },
    setStart: function (y_m) {
      let { year, month } = this._parseYM(y_m);
      let startDate = new Date(year, month - 1, 1);
      let _startYM = {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1
      };
      this.setData({
        _startYM,
        startDate: startDate.getTime()
      })
    },
    _setStartByEndDate: function () {
      let endDate = new Date(this.data.endDate);
      var startMonth = endDate.getMonth() - 5; // 6 months in total
      var startYear = endDate.getFullYear();
      if (startMonth <= 0) {
        startYear -= 1;
        startMonth += 12;
      }
      let startDate = new Date(startYear, startMonth, 1);
      let _startYM = {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1
      };
      this.setData({
        _startYM,
        startDate: startDate.getTime()
      })
    },
    onAttached: function () {
      // 在组件实例进入页面节点树时执行
      console.log('in attached: ', this.data.end);
      this.setEnd(this.data.end);

      if (this.data.start != null) {
        this.setStart(this.data.start);
      }
      else {
        this._setStartByEndDate();
      }
    },
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
    },

    show: function () {
      Dialog.alert({
        title: '设置起止年月',
        showConfirmButton: true,
        showCancelButton: true,
        context: this
      }).then(() => {
        // on close
      }).catch(reason => console.log('cancelled: ', reason));
    }
  }
})
