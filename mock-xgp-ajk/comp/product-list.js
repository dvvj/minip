// comp/product-list.js
const util = require('../utils/util.js');
const toastUtil = require('../utils/toast-util.js');
const datasrc = require('../utils/' + util.datasrc).datasrc;

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
    products: [],
    productDict: {},
    isCustomerInfoComplete: false
  },

  /**
   * Component methods
   */
  methods: {
    initData: function(products) {
      // console.log("products: ", products);
      let productDict = {}
      for (var idx = 0; idx < products.length; idx++) {
        let item = products[idx]
        productDict[item.id] = item
      }
      let isCustomerInfoComplete = util.getCustomerInfo();
      console.log(`products.length: ${products.length}, isCustomerInfoComplete: ${isCustomerInfoComplete}`);

      this.setData({ products, productDict, isCustomerInfoComplete });
    },

    updateProd: function (prodId, delta) {
      let productDict = this.data.productDict;
      let prod = productDict[prodId];
      prod.count += delta
      prod.totalPrice = util.roundPrice(prod.actualPrice * prod.count)
      // console.log('prod: ', prodDict[prodId])
      let products = this.data.products
      products.forEach(function (item) { if (item === prodId) item.totalPrice = util.roundPrice(prod.count * item.actualPrice) })
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

    doPay: function(payInfo) {
      wx.requestPayment({
        'timeStamp': payInfo.timeStamp,
        'nonceStr': payInfo.nonceStr,
        'package': payInfo.package,
        'signType': payInfo.signType,
        'paySign': payInfo.paySign,
        success: function (r3) {
          console.info('[doPay]: ', r3)
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

    onDetail: function(e) {
      let prodId = e.target.dataset.id;
      let currProduct = this.data.productDict[prodId];
      console.log('currProduct: ', currProduct);
      wx.setStorageSync(util.currProductKey, currProduct);
      wx.navigateTo({
        url: '../../prod/customer/product-detail',
      })
    },

    completeCustomerInfoOrBuy: function(prodId) {
      //toastUtil.fail(this, '请完善姓名地址等信息');
      let that = this;

      toastUtil.waiting(this, true, '获取资料中...');
      datasrc.customer.preCompleteCustomerInfo(
        resp => {
          toastUtil.waiting(that, false);
          console.log('resp', resp);

          if (resp.success) {
            let currCustomer = resp.data;
            let isComplete = that.checkCustomerInfoComplete(currCustomer);
            util.saveCustomerInfo(isComplete);
            that.setData({ isCustomerInfoComplete: isComplete });
  
            if (!isComplete) {
              let completeCustomerInfoDlg = that.selectComponent("#completeCustomerInfoDlg");
              completeCustomerInfoDlg.initData(currCustomer);
              completeCustomerInfoDlg.showDlg();
            }
            else {
              that.buyProduct(prodId);
            }
          }

        }
      )
    },

    checkCustomerInfoComplete: function(customerInfo) {
      return customerInfo.userName && customerInfo.idCardNo && customerInfo.postAddr ? true : false;
    },

    buyProduct: function(prodId) {
      let prod = this.data.productDict[prodId];
      console.log('prod: ', prod);
      let tokens = util.getStoredTokens();
      let that = this;
      let userid = util.getUserId(); //wx.getStorageSync(util.userIdKey)
      let totalCost = Math.round(prod.totalPrice * 100);

      toastUtil.waiting(this, true, '支付准备中...');
      wx.request({
        url: util.wxpayReqUrl(), //util.wePayezUrl(),
        data: {
          // customerId: userid,
          productId: prodId,
          prodCount: prod.count,
          info: prod.name,
          totalCost
        },
        method: "POST",
        header: util.postJsonReqHeader(tokens),
        success: function (r2) {
          //console.log('[onBuy] WePayez pay_info: ', r2);
          //let payInfo = r2.data;
          console.log('[onBuy] WxPay info: ', r2);
          let payInfo = {
            ...r2.data,
            package: r2.data.package_
          };

          toastUtil.waiting(that, false);
          that.doPay(payInfo);
        },
        fail: function (e2) {
          console.info("e2: ", e2)
        }
      })
    },

    onBuy: function(e) {
      let prodId = e.target.dataset.id;
      let isCustomerInfoComplete = this.data.isCustomerInfoComplete;
      console.log('isCustomerInfoComplete', isCustomerInfoComplete);
      if (!isCustomerInfoComplete) {
        this.completeCustomerInfoOrBuy(prodId);
        return;
      }
      else {
        this.buyProduct(prodId);
      }

    }
  }
})
