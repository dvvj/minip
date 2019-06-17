// pages/customer/reffed-order-stats.js
let wxCharts = require('../../utils/wxcharts-min.js');
let roundPrice = function (price) {
  var p100 = Math.round(price * 100)
  return p100 / 100.0;
};

let roundPriceArr = function (arr) {
  return arr.map(i => roundPrice(i))
};

const util = require('../../utils/util.js')
const reffedOrderStatsUrl = util.webappBase + '/medprof/reffedOrderStats4Wx'

Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad00: function (options) {
    let that = this;

    util.promisify(wx.getStorage)({ key: "tokens" })
      .then(res => {
        let tokens = res.data
        console.log('got tokens: ', tokens)

        wx.request({
          url: reffedOrderStatsUrl,
          method: 'POST',
          data: {
            customerId: "c＿o1a1p1_customer1",
            startDate: "2018-11-01",
            endDate: "2019-04-01"
          },
          header: {
            'Authorization': 'Bearer ' + tokens.accessToken,
            'X-Auth-Token': tokens.xauth
          },
          success: function (r1) {
            console.log('r1:', r1);
            util.saveTokens(r1.header[util.xAuthHeader], tokens.accessToken);

            let rawData = r1.data
            that.setData({ customerInfos: rawData })

            new wxCharts({
              canvasId: 'columnCanvas',
              type: 'column',
              categories: rawData.yearMonths, //['2012', '2013', '2014', '2015', '2016', '2017'],
              series: [{
                name: 'sales',
                data: roundPriceArr(rawData.sales)
              }, {
                name: 'rewards',
                data: roundPriceArr(rawData.rewards)
              }],
              yAxis: {
                format: function (val) {
                  return val + '元';
                }
              },
              width: 320,
              height: 200
            });
          }
        })
      }).catch(function (reason) {
        console.log('failed:', reason);
      })
  },

  onLoad: function (options) {
    let rawData = {
      "yearMonths": [
        "2018-11",
        "2018-12",
        "2019-01",
        "2019-02",
        "2019-03",
        "2019-04"
      ],
      "sales": [
        299.99,
        299.99,
        0,
        0,
        0,
        0
      ],
      "rewards": [
        29.999000000000002,
        29.999000000000002,
        0,
        0,
        0,
        0
      ]
    }

    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: rawData.yearMonths, //['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: 'sales',
        data: roundPriceArr(rawData.sales)
      }, {
        name: 'rewards',
        data: roundPriceArr(rawData.rewards)
      }],
      yAxis: {
        format: function (val) {
          return val + '元';
        }
      },
      width: 320,
      height: 200
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})