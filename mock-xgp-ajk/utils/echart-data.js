const util = require('util.js');
const legends = {
  sales: '销售额',
  rewards: '佣金'
};

const optionFrom = function(optionData) {
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
      data: [legends.sales, legends.rewards]
    },
    grid: {
      left: 20,
      right: 20,
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
        name: legends.sales,
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
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
        name: legends.rewards,
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
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

const optionEmptyData = optionFrom({
  yearMonths: [],
  sales: [],
  rewards: []
});

module.exports = {
  optionFrom,
  optionEmptyData
}