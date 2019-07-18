const userid = {
  pattern: /^[a-zA-Z][\da-zA-Z]*$/,
  errorMsg: '用户id必须以c_作为前缀，主体部分必须以字母为首，其余部分只能使用数字或者字母'
};

const checkRegex = function (input, regex) {
  console.log(`input: ${input}, regex: ${regex.pattern}, match: ${regex.pattern.test(input)}`);
  if (!regex.pattern.test(input)) {
    return regex.errorMsg;
  }
  else return '';
};

const checkInputUserId = function(newId) {
  var err = '';
  if (newId) {
    if (!newId.startsWith('c_')) {
      err = "用户id必须以'c_'开头";
    }
    else {
      let rem = newId.substring(2);
      err = checkRegex(rem, userid);
    }
  }
  else {
    err = '用户id不能为空';
  }
  return err;
};


module.exports = {
  checkInputUserId: checkInputUserId
}