"use strict";
var jwt = require("jwt-simple");
var moment = require("moment");
var secret = process.env.SECRET_KEY;

exports.createToken = function(user) {
  var payload = {
    sub: user._id,
    name: user.firstName,
    last_name: user.lastName,
    role: user.type,
    email: user.email,
    iat: moment().unix(),
    exp: moment(30, "days").unix
  };

  return jwt.encode(payload, secret);
};
