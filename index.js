var express = require("express");
var app = express();
var port = 3014;
app.get("/", function (req, res) {
    console.log("Working");
});
app.get("/api/sendCode/:code", function (req, res) {
    console.log("Got code Route" + req.params.code);
});
app.listen(port, function () {
    console.log("Listening on Port " + port);
});
