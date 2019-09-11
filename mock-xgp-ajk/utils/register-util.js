
//'{ "userType": "Customer", "profId": "p-prof", "profileReq": { "productIds": [1,2,3], "pricePlanId": "PrFixed-0.95" }}
const genQRStrCustomer = function(
  prodIds,
  uid,
  pricePlanId
) {
  let prodIdsStr = prodIds.join(',');
  return `{"ut":"c","uid":"${uid}","pfr":{"pids":[${prodIdsStr}],"ppid":"${pricePlanId}"}}`
};

const genQRStrMedProf = function (
  uid,
  rewardPlanId
) {
  return `{"ut":"p","uid":"${uid}","pfr":{"rpid":"${rewardPlanId}"}}`
};
const genQRStrProfOrgAgent = function (
  uid,
  rewardPlanId
) {
  return `{"ut":"a","uid":"${uid}","pfr":{"rpid":"${rewardPlanId}"}}`
};

const userTypeMap = {
  'c': "Customer",
  'p': "MedProf",
  'a': "ProfOrgAgent",
  'o': 'ProfOrg'
};

const parseUserType = function (j) {
  let t = JSON.parse(j);
  return t.ut;
};

const parseJsonCustomer = function(j) {
  let t = JSON.parse(j);
  return {
    userType: userTypeMap[t.ut],
    uid: t.uid,
    profileReq: {
      productIds: t.pfr.pids,
      pricePlanId: t.pfr.ppid
    }
  }
};

const convertCustomer = function(wxCustomer) {
  return {
    uid: wxCustomer.userid,
    postalAddr: wxCustomer.postAddr,
    name: wxCustomer.userName,
    passHash: wxCustomer.password,
    idCardNo: wxCustomer.idCardNo,
    mobile: wxCustomer.mobile,
    bday: wxCustomer.bday,
  };
};

module.exports = {
  genQRStrCustomer,
  genQRStrMedProf,
  genQRStrProfOrgAgent,
  parseJsonCustomer,
  convertCustomer,
  parseUserType
};