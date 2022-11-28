"use strict";
exports.__esModule = true;
var Product = /** @class */ (function () {
    function Product(apiString) {
        this.error = 0;
        this.name = "";
        this.detail = "";
        this.manufacturer = "";
        this.mainCat = "";
        this.subCat = "";
        this.contents = 0;
        this.packageInfo = 0;
        this.description = "";
        this.origin = "";
        this.convertApiString(apiString);
    }
    Product.prototype.convertApiString = function (input) {
        var lineArr = input.split("\n");
        for (var i = 0; i < lineArr.length; i++) {
            this.fillObjData(lineArr[i]);
        }
    };
    Product.prototype.fillObjData = function (input) {
        if (!input.includes("=")) {
            return;
        }
        var processValue = input.split("=");
        switch (processValue[0]) {
            case "error":
                this.error = parseInt(processValue[1]);
                break;
            case "name":
                this.name = processValue[1];
                break;
            case "detailname":
                this.detail = processValue[1];
                break;
            case "vendor":
                this.manufacturer = processValue[1];
                break;
            case "maincat":
                this.mainCat = processValue[1];
                break;
            case "subcat":
                this.subCat = processValue[1];
                break;
            case "contents":
                this.contents = parseInt(processValue[1]);
                break;
            case "pack":
                this.packageInfo = parseInt(processValue[1]);
                break;
            case "descr":
                this.description = processValue[1];
                break;
            case "origin":
                this.origin = processValue[1];
                break;
        }
    };
    Product.prototype.reduceObj = function () {
        var outObj = {
            error: this.error,
            name: this.name,
            detail: this.detail,
            manufacturer: this.manufacturer,
            mainCat: this.mainCat,
            subCat: this.subCat,
            contents: this.contents,
            packageInfo: this.packageInfo,
            description: this.description,
            origin: this.origin
        };
        return outObj;
    };
    return Product;
}());
exports["default"] = Product;
