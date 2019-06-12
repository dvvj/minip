// pages/toUse/medprof/reffed-customers.js
Page({

  /**
   * Page initial data
   */
  data: {
    customerInfos: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let rawData = [
      {
        "profileId": 1,
        "customerName": "张晓东",
        "customerId": "c＿o1a1p1_customer1",
        "productShortNames": [
          "Astaxin虾青素",
          "ACO产妇维生素"
        ],
        "pricePlanInfo": "{\"globalRate\":0.9}",
        "healthTags": [
          "糖尿病",
          "高血压"
        ],
        "medicineTags": [
          "降压药"
        ]
      },
      {
        "profileId": 2,
        "customerName": "张晓",
        "customerId": "c＿o1a1p1_customer2",
        "productShortNames": [
          "Astaxin虾青素",
          "ACO产妇维生素"
        ],
        "pricePlanInfo": "{\"globalRate\":0.9}",
        "healthTags": [
          "糖尿病"
        ],
        "medicineTags": [
          "维生素"
        ]
      },
      {
        "profileId": 3,
        "customerName": "张丽",
        "customerId": "c＿o1a1p1_customer4",
        "productShortNames": [
          "Astaxin虾青素"
        ],
        "pricePlanInfo": "{\"globalRate\":0.9}",
        "healthTags": [
          "贫血"
        ],
        "medicineTags": []
      }
    ]

    this.setData({ customerInfos: rawData })
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