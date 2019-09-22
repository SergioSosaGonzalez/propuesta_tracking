"use strict";
var mongoose = require("mongoose");
var schema = mongoose.Schema;
var UsersSchema = schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  city: String,
  zip: Number,
  phone: String,
  password: String,
  temporalPass: String
});
module.exports = mongoose.model("Users", UsersSchema);
