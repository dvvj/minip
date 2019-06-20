// pages/mock/customer/product-list.js
const util = require('../../../utils/util.js')

let roundPrice = function (price) {
  var p100 = Math.round(price * 100)
  return p100 / 100.0;
};

const customerProductUrl = util.webappBase + '/customerProductView'
const wxPayUrl = util.webappBase + '/wx/payReq';
const sessionTestUrl = util.webappBase + '/sessionTest';

Page({

  /**
   * Page initial data
   */
  data: {
    activeTabIndex: 0
  },
  updateActiveTab: function(tabIndex) {
    this.setData({ activeTabIndex: tabIndex })
  },
  onTabbarChange: function (e) {
    console.log(e)
    wx.showToast({
      title: `切换到标签 ${e.detail}`,
      icon: 'none'
    });
    this.updateActiveTab(e.detail)
  },
  onSwiperChange: function (e) {
    console.log(e.detail.current)
    this.updateActiveTab(e.detail.current)
  },
  onBuy: function (e) {
    let prodId = e.target.dataset.id
    let prod = this.data.productDict[prodId]
    console.log('prod: ', prod)
    util.promisify(wx.getStorage)({ key: "tokens" })
      .then(res => {
        let tokens = res.data
        console.log('got tokens: ', tokens)
        wx.request({
          url: wxPayUrl,
          data: {
            productId: prodId,
            info: prod.name,
            totalAmount: 1
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + tokens.accessToken,
            'X-Auth-Token': tokens.xauth
          },
          success: function (r2) {
            console.log('r2: ', r2)
            util.saveTokens(r2.header[util.xAuthHeader], tokens.accessToken);
            wx.requestPayment({
              'timeStamp': r2.data.timeStamp,
              'nonceStr': r2.data.nonceStr,
              'package': r2.data.package_,
              'signType': 'MD5',
              'paySign': r2.data.paySign,
              success: function (r3) {
                console.info('r3: ', r3)
                //报名
                //goApply(event, that)
              },
              fail: function (e3) {
                console.info("e3: ", e3)
              },
              complete: function (c3) {
                console.info("c3: ", c3)
              }
            })
          },
          fail: function (e2) {
            console.info("e2: ", e2)
          }
        })
      })
  },

  updateProd: function (prodId, delta) {
    let prod = this.data.productDict[prodId]
    let productDict = this.data.productDict
    prod.count += delta
    prod.totalPrice = roundPrice(prod.actualPrice * prod.count)
    // console.log('prod: ', prodDict[prodId])
    let products = this.data.products
    products.forEach(function (item) { if (item === prodId) item.totalPrice = roundPrice(prod.count * item.actualPrice) })
    this.setData({ productDict, products })
  },

  onPlus: function (e) {
    console.log(e)
    let prodId = e.target.dataset.id
    this.updateProd(prodId, 1)
  },

  onMinus: function (e) {
    console.log(e)
    let prodId = e.target.dataset.id
    this.updateProd(prodId, -1)
  },

  loadProds: function () {

  },
  onLoad00: function (options) {
    let that = this
    util.promisify(wx.getStorage)({ key: "tokens" })
      .then(res => {
        let tokens = res.data
        console.log('got tokens: ', tokens)

        wx.request({
          url: customerProductUrl,
          method: 'GET',
          header: {
            'Authorization': 'Bearer ' + tokens.accessToken,
            'X-Auth-Token': tokens.xauth
          },
          success: function (r1) {
            console.log('r1:', r1);
            util.saveTokens(r1.header[util.xAuthHeader], tokens.accessToken);

            let resDataRaw = r1.data
            var resData = resDataRaw.map(item => {
              let actualPrice = roundPrice(item.actualPrice);
              let price0 = roundPrice(item.product.price0)
              var hasDiscount = actualPrice < price0;
              var resDataItem = {
                id: item.product.id,
                imgUrl: `${util.imgBaseUrl}/${item.product.id}/${item.productAssets[0].url}`,
                name: item.product.name,
                price0: price0,
                actualPrice: actualPrice,
                hasDiscount: hasDiscount,
                referingProfName: item.referingProfName,
                count: 1,
                totalPrice: actualPrice
              }
              return resDataItem;
            })

            let productDict = {}
            console.log('resData.length: ', resData.length)
            for (var idx = 0; idx < resData.length; idx++) {
              //console.log('resData[idx]', resData[idx])
              let item = resData[idx]
              productDict[item.id] = item
            }

            that.setData({ products: resData, productDict: productDict })
          }
        })
      }).catch(function (reason) {
        console.log('failed:', reason);
      })

  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var resDataRaw = [
      {
        "customerId": "c＿o1a1p1_customer1",
        "product": {
          "id": 1,
          "name": "Astaxin虾青素",
          "price0": 1499.99,
          "detailedInfo": "{\"srcCountry\":\"SV\",\"desc\":\"虾青素清除自由基的能力是维生素C的功效的6000倍；是维生素E的1000倍；是辅酶Q10的800倍；是一氧化氮的1800倍；是纳豆的3100倍；是花青素的700倍；是β-胡萝卜素功效的10倍；是lycopene（番茄红素）功效的1800倍；是carotol（叶黄素）功效的200倍；是teapolyphenols（茶多酚）功效的320倍。\"}",
          "keywords": "抗氧化剂,美白",
          "categories": "8002000,2000000"
        },
        "productAssets": [
          {
            "url": "1.jpg",
            "typ": "img",
            "cat": "cat1"
          },
          {
            "url": "2.png",
            "typ": "img",
            "cat": "cat1"
          },
          {
            "url": "3.png",
            "typ": "img",
            "cat": "cat2"
          },
          {
            "url": "1.pdf",
            "typ": "doc",
            "cat": "cat3"
          },
          {
            "url": "2.pdf",
            "typ": "doc",
            "cat": "cat1"
          }
        ],
        "referingProfName": "朱卫东",
        "actualPrice": 1349.991
      },
      {
        "customerId": "c＿o1a1p1_customer1",
        "product": {
          "id": 2,
          "name": "瑞典ACO Gravid孕妇产妇复合维生素",
          "price0": 139.99,
          "detailedInfo": "{\"srcCountry\":\"SV\",\"desc\":\"含有12种维生素和10种矿物质。针对孕期和哺乳期女性对于营养的额外需求添加了如叶酸、铁、钙和维生素D在内的多种维生素和矿物质。含有重要的抗氧化功能的维生素C和E，能够防止DNA，蛋白质和脂肪的氧化变化。\"}",
          "keywords": "孕产妇,维生素,矿物质",
          "categories": "8007000,8006000"
        },
        "referingProfName": "朱卫东",
        "actualPrice": 125.99100000000001
      },
      {
        "customerId": "c＿o1a1p1_customer1",
        "product": {
          "id": 3,
          "name": "Pharbio Omega-3 Forte 70%高纯度深海鱼油",
          "price0": 9.99,
          "detailedInfo": "{\"srcCountry\":\"SV\",\"desc\":\"瑞典销量最好，品质最高的成人鱼油，也是世界上纯度最高的鱼油，是瑞典国家药房鱼油销量冠军。70%的Omega3 含量（DHA/EPA), 瑞典医生唯一推荐孕妇哺乳期间补充DHA/EPA的鱼油，含DHA有助于宝宝大脑、眼睛等器官的发育。Pharbio产品完全按照欧洲严格的药品标准生产，高纯度源自先进的生产工艺，去除了鱼油本身含有的大部分饱和脂肪酸。在普通天然鱼油中，大约含有20-25%的不需要的饱和脂肪酸，而Pharbio Omega-3 Forte胶囊只含有5%不需要的饱和脂肪酸。将对人体有害的饱和脂肪酸尽量剔除并提纯（世界上没有任何一款鱼油是可以完全剔除饱和脂肪酸的），从营养学角度认为非重要的脂肪酸性物质以及可能存在的环境毒素和重金属也被尽量剔除，确保是健康有效的鱼油，纯度世界第一高！\"}",
          "keywords": "鱼油,Omega-3",
          "categories": "5001000"
        },
        "referingProfName": "朱鑫",
        "actualPrice": 9.490499999999999
      },
      {
        "customerId": "c＿o1a1p1_customer1",
        "product": {
          "id": 4,
          "name": "LIFE Q10 100mg 辅酶",
          "price0": 149.99,
          "detailedInfo": "{\"srcCountry\":\"US\",\"desc\":\"每粒Life Q10包含30毫克辅酶Q10，也叫作辅酶q，它是一种脂溶性的类似维生素的物质。Q10的主要功能是在细胞线粒体能量（三磷酸腺苷）合成时充当辅酶。所有的细胞都是靠三磷酸腺苷才能进行各种活动流程，因此辅酶对身体所有的细胞而言都是至关重要的，如此一来，辅酶对所有组织和器官的重要性也就不言而喻了。\"}",
          "keywords": "辅酶Q10",
          "categories": "8003000"
        },
        "referingProfName": null,
        "actualPrice": 149.99
      }
    ]

    var resData = resDataRaw.map(item => {
      let actualPrice = roundPrice(item.actualPrice);
      let price0 = roundPrice(item.product.price0)
      var hasDiscount = actualPrice < price0;
      var resDataItem = {
        id: item.product.id,
        imgUrl: '/images/product1.png', //item.productAssets[0].url,
        name: item.product.name,
        price0: price0,
        actualPrice: actualPrice,
        hasDiscount: hasDiscount,
        referingProfName: item.referingProfName,
        count: 1,
        totalPrice: actualPrice
      }
      return resDataItem;
    })

    let productDict = {}
    console.log('resData.length: ', resData.length)
    for (var idx = 0; idx < resData.length; idx++) {
      //console.log('resData[idx]', resData[idx])
      let item = resData[idx]
      productDict[item.id] = item
    }

    this.setData({ products: resData, productDict: productDict })

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