const toastById = function(context, cid) {
  let compid = cid ? cid : '#waitingToast';
  return context.selectComponent(compid);
};

const waiting = function (context, doShow, msg, cid) {
  let toast = toastById(context, cid);
  doShow ? toast.show(msg) : toast.clear();
};

const success = function (context, msg, cid) {
  let toast = toastById(context, cid);
  toast.success(msg);
};

const fail = function (context, msg, cid) {
  let toast = toastById(context, cid);
  toast.success(msg);
};

module.exports = {
  waiting,
  success,
  fail
};