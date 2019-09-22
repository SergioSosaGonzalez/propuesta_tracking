"use strict";
var express = require("express");
var bodyParser = require("body-parser");
//Inicializacion de npm para poner autenticacion al socket por medio de tokens
var jwtAuth = require("socketio-jwt-auth");

var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
//Here config routes
let loginRoutes = require("./routes/LoginRoutes");

//Here are middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware en donde se autentica el socket, si contiene el token procede a conectarse al socket, en caso de no tener token no hace nada
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

//Objeto que funciona para almacenar a los clientes que se estan conectando y de esa manera mandar la informacion al dashboard a pintar
var clients = {};
//Socket

//Metodo en donde se indica que el usuario se conecto al socket
io.on("connection", function(socket) {
  console.log("El nodo: " + socket.handshake.address + " se ha conectado");
  socket.on("coordenites", function(data) {
    //Se almacena el id del socket como nombre de la propiedad del objeto cliente y se agregan las coordenadas
    clients[socket["id"]] = data;
    //io.sockets.emit("clients-coordinates", messages);
  });

  //Metodo que nos indica cuando se desconecta un dispositivo
  socket.on("disconnect", function() {
    console.log("Dispositivo Desconectado");
    delete clients[socket["id"]];
  });
});

//Routes
app.use("/api", loginRoutes);
//Export
module.exports = server;
