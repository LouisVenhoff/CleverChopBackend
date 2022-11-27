"use strict";
exports.__esModule = true;
var eanApiController_1 = require("./classes/eanApiController");
var express = require("express");
var app = express();
var port = 3014;
var eanSource = new eanApiController_1["default"]("400000000");
app.get("/", function (req, res) {
    console.log("Working");
});
app.get("/api/sendCode/:code", function (req, res) {
    console.log("Got code Route" + req.params.code);
    eanSource.requestEan(req.params.code);
});
app.listen(port, function () {
    console.log("Listening on Port " + port);
});
