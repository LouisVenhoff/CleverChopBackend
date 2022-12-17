"use strict";
exports.__esModule = true;
var mysql = require('mysql');
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager(host, username, password) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.connect();
    }
    DatabaseManager.prototype.connect = function () {
        this.sqlConnection = mysql.createConnection({
            host: this.host,
            user: this.username,
            password: this.password
        });
        this.sqlConnection.connect(function (err) {
            if (!err) {
                console.log("Connection successfully!");
            }
            else {
                console.log("Connection error!");
            }
        });
    };
    DatabaseManager.prototype.disconnect = function () {
        this.sqlConnection.end();
    };
    return DatabaseManager;
}());
exports["default"] = DatabaseManager;
