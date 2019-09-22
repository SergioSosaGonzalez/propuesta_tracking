"use strict";
var app = require("./app");
const { PORT } = process.env;
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb://theNameOfYourUser:yourpassword123@localhost:27017/urgegas",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT, function() {
      console.log("Servidor esta funcionando");
    });
  })
  .catch(err => console.log(err));
