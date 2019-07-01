// comp/profit-stats.js
const wxCharts = require('../utils/wxcharts-min.js');
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
    startEnd: {},
    chartData: {}
  },

  /**
   * Component methods
   */
  methods: {
    initData: function (startEnd, chartData) {
      this.setData({
        startEnd,
        chartData
      });
    },
    drawChart: function() {
      let chartData = this.data.chartData;
      console.log(chartData);
      new wxCharts({
        canvasId: 'columnCanvas',
        type: 'column',
        categories: chartData.yearMonths,
        series: [{
          name: '销售额',
          data: util.roundPriceArr(chartData.sales)
        }, {
          name: '佣金',
            data: util.roundPriceArr(chartData.rewards)
        }],
        yAxis: {
          format: function (val) {
            return val + '元';
          }
        },
        width: 360,
        height: 360
      });
    }
  }
})
