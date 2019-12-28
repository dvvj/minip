// comp/_registration/_customer/existing-customer-info.js
const toastUtil = require('../../../utils/toast-util.js');
const util = require('../../../utils/util.js');
const registerUtil = require('../../../utils/register-util.js');
const inputCheck = require('../../../utils/input-check.js');
const datasrc = require('../../../utils/' + util.datasrc).datasrc;

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
    existingCustomer: {}
  },

  /**
   * Component methods
   */
  methods: {

    getExistingCustomer: function() {
      return this.data.existingCustomer;
    },

    onInputExistingId: function (e) {
      let { cidOrMobile, ...others } = this.data.existingCustomer;
      let existingCustomer = { cidOrMobile: e.detail, ...others };
      this.setData({ existingCustomer });
    },

    onGetExistingCustomer: function () {
      let that = this;
      let queryReq = { idOrMobile: this.data.existingCustomer.cidOrMobile };
      console.log('[todo] onGetExistingCustomer', queryReq);

      toastUtil.waiting4dlg(this, true, '查询用户中')
      datasrc.registration.queryExistingCustomer(
        queryReq,
        respData => {
          toastUtil.waiting4dlg(that, false);
          console.log('respData', respData);

          if (respData.msg) {
            toastUtil.fail4dlg(that, respData.msg);
            let existingCustomer = {
              cidOrMobile: this.data.existingCustomer.cidOrMobile
            };
          }
          else {
            let existingCustomer = {
              cidOrMobile: this.data.existingCustomer.cidOrMobile,
              ...respData
            };
            this.setData({ existingCustomer });
          }
          // let { success, msg } = respData;
          // let message = success ? '添加成功' : `添加失败: ${msg}`
          // success ? toastUtil.success(that, message) : toastUtil.fail(that, message);
        }
      )
    }

  }
})
