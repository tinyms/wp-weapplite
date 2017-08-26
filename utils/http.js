'use strict';


function _fetch(params) {
  var user_auth = wx.getStorageSync('user_auth') || {};
  var custom = {
    'complete': function (data, statusCode, header) {
      if (data.statusCode === 403 || data.statusCode === 401) {
        wx.setStorageSync('user_auth', {})
        wx.setStorageSync('user_info', {});
        console.log('重新获取会话令牌');
        var re_get_user_token_num = wx.getStorageSync('re_get_user_token_num') || 0;
        // 允许重复请求3次.
        if (re_get_user_token_num < 3) {
          wx.setStorageSync('re_get_user_token_num', re_get_user_token_num + 1);
          _auth(function (user_info) {
            console.log('再次发送请求');
            _fetch(params);
          });
        }
      }
    },
    'fail': function (data, statusCode, header) {
      console.log(data, statusCode, header);
    }
  };
  if (user_auth.hasOwnProperty('token')) {
    custom['header'] = { 'Authorization': 'JWT ' + user_auth.token };
  }
  Object.assign(params, custom);
  wx.request(params);
}

module.exports = {
  fetch: _fetch
}