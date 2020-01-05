
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
  rewardPlanId,
  rewardPlanInfo
) {
  return `{"ut":"p","uid":"${uid}","pfr":{"rpid":"${rewardPlanId}","info":"${rewardPlanInfo}"}}`
};
const genQRStrProfOrgAgent = function (
  uid,
  rewardPlanId,
  rewardPlanInfo
) {
  return `{"ut":"a","uid":"${uid}","pfr":{"rpid":"${rewardPlanId}","info":"${rewardPlanInfo}"}}`
};

const userTypes = {
  Customer: 'c',
  MedProf: 'p',
  ProfOrgAgent: 'a',
  ProfOrg: 'o'
};

let createUserTypeMap = () => {
  var res = {};
  res[userTypes.Customer] = "Customer";
  res[userTypes.MedProf] = "MedProf";
  res[userTypes.ProfOrgAgent] = "ProfOrgAgent";
  res[userTypes.ProfOrg] = "ProfOrg";
  return res;
}

const userTypeMap = createUserTypeMap();

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

const parseJsonMedProf = function (j) {
  let t = JSON.parse(j);
  return {
    userType: userTypeMap[t.ut],
    agentId: t.uid,
    rewardPlanId: t.pfr.rpid,
    rewardPlanInfo: t.pfr.info
  }
};

const parseJsonProfOrgAgent = function (j) {
  let t = JSON.parse(j);
  return {
    userType: userTypeMap[t.ut],
    orgId: t.uid,
    rewardPlanId: t.pfr.rpid,
    rewardPlanInfo: t.pfr.info
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
  parseJsonMedProf,
  parseJsonProfOrgAgent,
  convertCustomer,
  parseUserType,
  userTypes
};