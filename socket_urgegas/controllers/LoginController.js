"use strict";
var Users = require("../models/user");
var jwt = require("../services/jwt");
var bcrypt = require("bcrypt-nodejs");

function login(req, resp) {
  var params = req.body;
  let email = params.email;
  let password = params.password;
  Users.findOne({ email: email }, (err, user) => {
    if (err) return resp.status(500).send({ message: "Error" });
    if (user) {
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          //if (params.gettoken) {
          //Generar el token
          return resp.status(200).send({ token: jwt.createToken(user) });
          /*} else {
            user.password = undefined;
            return resp.status(200).send({ user });
          }*/
        } else {
          return resp
            .status(404)
            .send({ message: "No se ha podido identificar al usuario" });
        }
      });
    } else {
      return resp.status(404).send({ message: "Usuario no identificado" });
    }
  });
}
function test(req, resp) {
  console.log("gola");
  return resp.status(200).send({ message: "Llego correctamente" });
}
module.exports = {
  login,
  test
};
