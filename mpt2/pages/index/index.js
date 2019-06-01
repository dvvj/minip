//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    objectArray: [
      { id: 5, unique: 'unique_5' },
      { id: 1, unique: 'unique_1' },
      { id: 3, unique: 'unique_3' },
      { id: 0, unique: 'unique_0' },
    ],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    time: (new Date()).toString(),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    min: 1,
    max: 100,
    sliderValue: 2
  },
  onAdd: function () {
    var newVal = this.data.sliderValue + 1
    this.setData({ sliderValue: newVal })
  },
  onMinus: function () {
    var newVal = this.data.sliderValue - 1
    this.setData({ sliderValue: newVal })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../circle/circle'
    })
  },
  doSwitch: function (e) {
    const length = this.data.objectArray.length
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length)
      const y = Math.floor(Math.random() * length)
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function (e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{ id: length, unique: 'unique_' + length }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  onLoad: function () {

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
