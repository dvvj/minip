
//'{ "userType": "Customer", "profId": "p-prof", "profileReq": { "productIds": [1,2,3], "pricePlanId": "PrFixed-0.95" }}
const genQRStrCustomer = function(
  prodIds,
  profId,
  pricePlanId
) {
  let prodIdsStr = prodIds.join(',');
  return `{"ut":"c","pid":"${profId}","pfr":{"pids":[${prodIdsStr}],"ppid":"${pricePlanId}"}}`
};

const userTypeMap = {
  'c': "Customer",
  'p': "MedProf",
  'a': "ProfOrgAgent",
  'o': 'ProfOrg'
};

const parseJsonCustomer = function(j) {
  let t = JSON.parse(j);
  return {
    userType: userTypeMap[t.ut],
    profId: t.pid,
    profileReq: {
      productIds: t.pfr.pids,
      pricePlanId: t.pfr.ppid
    }
  }
};

module.exports = {
  genQRStrCustomer,
  parseJsonCustomer
};