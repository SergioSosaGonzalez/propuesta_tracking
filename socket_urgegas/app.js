"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var jwtAuth = require("socketio-jwt-auth");

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
//Here config routes
let loginRoutes = require("./routes/LoginRoutes");

//Here are middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
io.use(
  jwtAuth.authenticate(
    {
      secret: process.env.SECRET_KEY
    },
    function(payload, done) {
      console.log(payload);
      return done(null, "info");
    }
  )
);

//Here are Cores
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});
var clients = {};
//Socket

io.on("connection", function(socket) {
  console.log("El nodo: " + socket.handshake.address + " se ha conectado");
  socket.on("coordenites", function(data) {
    clients[socket["id"]] = data;
    //io.sockets.emit("clients-coordinates", messages);
  });
  socket.on("disconnect", function() {
    console.log("Dispositivo Desconectado");
    delete clients[socket["id"]];
  });
});

//Routes
app.use("/api", loginRoutes);
//Export
module.exports = server;
