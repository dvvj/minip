const checkRegex = function (input, regex) {
  console.log(`input: ${input}, regex: ${regex.pattern}, match: ${regex.pattern.test(input)}`);
  if (!regex.pattern.test(input)) {
    return regex.errorMsg;
  }
  else return '';
};

const userid = {
  pattern: /^[a-zA-Z][\da-zA-Z]*$/,
  errorMsg: '用户id必须以c_作为前缀，主体部分必须以字母为首，其余部分只能使用数字或者字母',
  check: function(input) {
    var err = '';
    if (input) {
      if (!input.startsWith('c_')) {
        err = "用户id必须以'c_'开头";
      }
      else {
        let rem = input.substring(2);
        err = checkRegex(rem, this);
      }
    }
    else {
      err = '用户id不能为空';
    }
    return err;
  }
};

const password = {
  pattern: /^.{3,}$/,
  errorMsg: '密码至少3位',
  check: function (input) {
    return checkRegex(input, this);
  }
};

const userName = {
  pattern: /^.{2,4}$/,
  errorMsg: '用户名为2-4个字符',
  check: function (input) {
    return checkRegex(input, this);
  }
};

const idCardNo = {
  pattern: /(^\d{15}$)|(^\d{17}(\d|X)$)/,
  errorMsg: '身份证必须为15或18位',
  check: function (input) {
    return checkRegex(input, this);
  }
};

const mobile = {
  pattern: /^\d{11}$/,
  errorMsg: 'todo：手机号必须是11位',
  check: function (input) {
    //return checkRegex(input, this);
    return '';
  }
};

const postAddr = {
  pattern: /^.{5,}$/,
  errorMsg: 'todo：邮寄地址太短？',
  check: function (input) {
    //return checkRegex(input, this);
    return true;
  }
};

module.exports = {
  userid,
  password,
  userName,
  idCardNo,
  mobile,
  postAddr
}