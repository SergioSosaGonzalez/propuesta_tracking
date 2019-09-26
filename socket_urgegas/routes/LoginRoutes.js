"use strict";
var express = require("express");
var UserController = require("../controllers/LoginController");
var api = express.Router();
api.post("/login", UserController.login);
api.post("/test", UserController.test);

module.exports = api;
