const toastById = function(context, cid) {
  let compid = cid ? cid : '#waitingToast';
  return context.selectComponent(compid);
};

const waiting = function (context, doShow, msg, cid) {
  let toast = toastById(context, cid);
  doShow ? toast.show4dlg(msg) : toast.clear();
};
const waiting4dlg = function (context, doShow, msg, cid) {
  let toast = toastById(context, cid);
  doShow ? toast.show4dlg(msg) : toast.clear();
};

const success = function (context, msg, cid) {
  let toast = toastById(context, cid);
  toast.success(msg);
};
const success4dlg = function (context, msg, cid) {
  let toast = toastById(context, cid);
  toast.success4dlg(msg);
};

const fail = function (context, msg, cid) {
  let toast = toastById(context, cid);
  toast.fail(msg);
};
const fail4dlg = function (context, msg, cid) {
  let toast = toastById(context, cid);
  toast.fail4dlg(msg);
};

module.exports = {
  waiting,
  waiting4dlg,
  success,
  success4dlg,
  fail,
  fail4dlg
};