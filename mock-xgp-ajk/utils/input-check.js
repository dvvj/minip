const MsgNoError = '';

const checkRegex = function (input, regex) {
  console.log(`input: ${input}, regex: ${regex.pattern}, match: ${regex.pattern.test(input)}`);
  if (!regex.pattern.test(input)) {
    return regex.errorMsg;
  }
  else return MsgNoError;
};

const uidChecker = function(input, prefix, checkerObj) {
  var err = MsgNoError;
  if (input) {
    if (!input.startsWith(prefix)) {
      err = checkerObj.errorMsg;
    }
    else {
      let rem = input.substring(2);
      err = checkRegex(rem, checkerObj);
    }
  }
  else {
    err = checkerObj.errorMsg;
  }
  return err;
}
const userid = {
  pattern: /^[a-zA-Z][\da-zA-Z]*$/,
  errorMsg: '用户id必须以c_作为前缀，主体部分必须以字母为首，其余部分只能使用数字或者字母',
  check: function(input) {
    return uidChecker(input, 'c_', userid);
  }
};

const profid = {
  pattern: /^[a-zA-Z][\da-zA-Z]*$/,
  errorMsg: '营养师id必须以p_作为前缀，主体部分必须以字母为首，其余部分只能使用数字或者字母',
  check: function (input) {
    return uidChecker(input, 'p_', profid);
  }
};

const agentid = {
  pattern: /^[a-zA-Z][\da-zA-Z]*$/,
  errorMsg: '业务员id必须以a_作为前缀，主体部分必须以字母为首，其余部分只能使用数字或者字母',
  check: function (input) {
    return uidChecker(input, 'a_', agentid);
  }
};

const password = {
  pattern: /^.{3,}$/,
  errorMsg: '密码至少3位',
  check: function (input) {
    return checkRegex(input, password);
  }
};

const genRegexChecker = function(pattern, errorMsg) {
  let tmp = {
    pattern, errorMsg,
    check: function (input) {
      return checkRegex(input, tmp);
    }
  }
  return tmp;
}

const userName = genRegexChecker(/^.{2,4}$/, '用户名为2-4个字符');
const name = genRegexChecker(/^.{2,4}$/, '用户名为2-4个字符');

const idCardNo = genRegexChecker(/(^\d{15}$)|(^\d{17}(\d|X)$)/, '身份证必须为15或18位');

const mobile = genRegexChecker(/^\d{11}$/, 'todo：手机号必须是11位');
const postAddr = genRegexChecker(/^.{5,}$/, 'todo：邮寄地址太短？');
const info = genRegexChecker(/^.{5,}$/, '最多可以输入255个字符');

module.exports = {
  userid,
  profid,
  agentid,
  password,
  userName,
  name,
  idCardNo,
  mobile,
  postAddr,
  info,
  MsgNoError
}