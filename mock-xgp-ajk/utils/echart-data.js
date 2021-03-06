const util = require('util.js');
const _legends = {
  sales: '销售额(￥)',
  salesQty: '销售量',
  rewards: '佣金(￥)',
  profits: '利润(￥)'
};

const optionQtyFrom = function (optionData, legends) {
  let { yearMonths, quantities } = optionData;
  return {
    color: ['#32c5e9'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: legends
    },
    grid: {
      left: 20,
      right: 40,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: yearMonths,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: legends[0],
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'right'
          }
        },
        data: quantities,
        itemStyle: {
        }
      }
    ]
  };
};

const optionFrom = function(optionData, legends) {
  let rounded = {
    yearMonths: optionData.yearMonths,
    sales: util.roundPriceArr(optionData.sales),
    rewards: util.roundPriceArr(optionData.rewards)
  }
  return {
    color: ['#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: legends
    },
    grid: {
      left: 20,
      right: 40,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        //data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
        data: rounded.yearMonths,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: legends[0],
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'right'
          }
        },
        //data: [120, 102, 141, 174, 190, 250, 220],
        data: rounded.sales,
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: legends[1],
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'right'
          }
        },
        //data: [300, 270, 340, 344, 300, 320, 310],
        data: rounded.rewards,
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      }

    ]
  };
};

const proforgOptionFrom = function(optionData) {
  return optionFrom(optionData, [_legends.sales, _legends.profits]);
};

const medprofOptionFrom = function (optionData) {
  return optionFrom(optionData, [_legends.sales, _legends.rewards]);
};

const qtyOptionFrom = function (optionData) {
  return optionQtyFrom(optionData, [_legends.salesQty]);
};


const _showStatsChart = function (chart, showMoney, chartDataRaw, isOrg) {
  if (showMoney) {
    let option = isOrg ? proforgOptionFrom(chartDataRaw) : medprofOptionFrom(chartDataRaw);
    console.log('option: ', option);
    chart.setOption(option, true);
  }
  else {
    let option = qtyOptionFrom(chartDataRaw);
    console.log('option: ', option);
    chart.setOption(option, true);
  }
};


const showStatsChart = function (chart, showMoney, chartDataRaw) {
  _showStatsChart(chart, showMoney, chartDataRaw, false);
};

const showStatsChart4Org = function (chart, showMoney, chartDataRaw) {
  _showStatsChart(chart, showMoney, chartDataRaw, true);
};

const proforgEmptyOption = proforgOptionFrom({
  yearMonths: [],
  sales: [],
  rewards: []
});

const medprofEmptyOption = medprofOptionFrom({
  yearMonths: [],
  sales: [],
  rewards: []
});

module.exports = {
  proforgOptionFrom,
  medprofOptionFrom,
  proforgEmptyOption,
  medprofEmptyOption,
  qtyOptionFrom,
  showStatsChart,
  showStatsChart4Org
}