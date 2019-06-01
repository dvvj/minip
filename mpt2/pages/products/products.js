// pages/products/products.js
import productTpl from "../../templates/product-tpl"
Page({

  /**
   * Page initial data
   */
  data: {
    
  },

  onTap: function(e) {
    //console.log('tapped', e)
    productTpl.onTap(e)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;

    var resData = [
      {
        "id": 1,
        "name": "Astaxin虾青素",
        "price0": 1499.99,
        "detailedInfo": "{\"srcCountry\":\"SV\",\"desc\":\"虾青素清除自由基的能力是维生素C的功效的6000倍；是维生素E的1000倍；是辅酶Q10的800倍；是一氧化氮的1800倍；是纳豆的3100倍；是花青素的700倍；是β-胡萝卜素功效的10倍；是lycopene（番茄红素）功效的1800倍；是carotol（叶黄素）功效的200倍；是teapolyphenols（茶多酚）功效的320倍。\"}",
        "keywords": "抗氧化剂,美白",
        "categories": "8002000,2000000"
      },
      {
        "id": 2,
        "name": "瑞典ACO Gravid孕妇产妇复合维生素",
        "price0": 139.99,
        "detailedInfo": "{\"srcCountry\":\"SV\",\"desc\":\"含有12种维生素和10种矿物质。针对孕期和哺乳期女性对于营养的额外需求添加了如叶酸、铁、钙和维生素D在内的多种维生素和矿物质。含有重要的抗氧化功能的维生素C和E，能够防止DNA，蛋白质和脂肪的氧化变化。\"}",
        "keywords": "孕产妇,维生素,矿物质",
        "categories": "8007000,8006000"
      },
      {
        "id": 3,
        "name": "Pharbio Omega-3 Forte 70%高纯度深海鱼油",
        "price0": 9.99,
        "detailedInfo": "{\"srcCountry\":\"SV\",\"desc\":\"瑞典销量最好，品质最高的成人鱼油，也是世界上纯度最高的鱼油，是瑞典国家药房鱼油销量冠军。70%的Omega3 含量（DHA/EPA), 瑞典医生唯一推荐孕妇哺乳期间补充DHA/EPA的鱼油，含DHA有助于宝宝大脑、眼睛等器官的发育。Pharbio产品完全按照欧洲严格的药品标准生产，高纯度源自先进的生产工艺，去除了鱼油本身含有的大部分饱和脂肪酸。在普通天然鱼油中，大约含有20-25%的不需要的饱和脂肪酸，而Pharbio Omega-3 Forte胶囊只含有5%不需要的饱和脂肪酸。将对人体有害的饱和脂肪酸尽量剔除并提纯（世界上没有任何一款鱼油是可以完全剔除饱和脂肪酸的），从营养学角度认为非重要的脂肪酸性物质以及可能存在的环境毒素和重金属也被尽量剔除，确保是健康有效的鱼油，纯度世界第一高！\"}",
        "keywords": "鱼油,Omega-3",
        "categories": "5001000"
      },
      {
        "id": 4,
        "name": "LIFE Q10 100mg 辅酶",
        "price0": 149.99,
        "detailedInfo": "{\"srcCountry\":\"US\",\"desc\":\"每粒Life Q10包含30毫克辅酶Q10，也叫作辅酶q，它是一种脂溶性的类似维生素的物质。Q10的主要功能是在细胞线粒体能量（三磷酸腺苷）合成时充当辅酶。所有的细胞都是靠三磷酸腺苷才能进行各种活动流程，因此辅酶对身体所有的细胞而言都是至关重要的，如此一来，辅酶对所有组织和器官的重要性也就不言而喻了。\"}",
        "keywords": "辅酶Q10",
        "categories": "8003000"
      }
    ]
    var productDict = {}
    console.log('resData.length: ', resData.length)
    for (var idx = 0; idx < resData.length; idx++) {
      //console.log('resData[idx]', resData[idx])
      var item = resData[idx]
      productDict[item.id] = item
    }
    wx.setStorage( {
      key: "productDict",
      data: productDict,
      success: function (res) {
        console.log("setStorage success: ", res)
      },
      fail: function(err) {
        console.log("setStorage error: ", err)
      },
      complete: function(e) {
        console.log("setStorage complete: ", e)
      }
    })
    that.setData({products: resData})
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