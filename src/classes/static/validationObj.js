"use strict";
exports.__esModule = true;
var ValidationObj = /** @class */ (function () {
    function ValidationObj(code, listOfProducts, expirationTime, onExpire) {
        var _this = this;
        this.obsolete = false;
        this.onExpire = function (productName) { };
        this.code = code;
        this.listOfCodes = listOfProducts;
        if (onExpire != undefined) {
            this.onExpire = onExpire;
        }
        setTimeout(function () {
            _this.expire();
        }, expirationTime);
    }
    ValidationObj.prototype.getCode = function () {
        return this.code;
    };
    ValidationObj.prototype.expire = function () {
        this.deleteFromList();
        this.obsolete = true;
        this.onExpire(this.code);
    };
    ValidationObj.prototype.deleteFromList = function () {
        var tempList = [];
        for (var i = 0; i < this.listOfCodes.length; i++) {
            if (this.listOfCodes[i] != this.code) {
                tempList.push(this.listOfCodes[i]);
            }
        }
        this.listOfCodes = tempList;
    };
    return ValidationObj;
}());
exports["default"] = ValidationObj;
