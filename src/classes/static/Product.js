"use strict";
exports.__esModule = true;
var Product = /** @class */ (function () {
    function Product(apiString) {
        this.error = 0;
        this.name = "";
        this.weight = "";
        this.manufacturer = "";
        this.packing = "";
        this.category = [];
        this.allergen = [];
        this.badArgs = [];
        this.goodArgs = [];
        this.commonInfo = [];
        this.nutriScore = "";
        this.ecoScore = "";
        this.code = "";
        this.convertApiString(apiString);
    }
    // public setCode(code:string)
    // {
    //     this.code = code;
    // }
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
            case "manufacturer":
                this.manufacturer = processValue[1];
                break;
        }
    };
    Product.prototype.reduceObj = function () {
        var outObj = {
            error: this.error,
            name: this.name,
            weight: this.weight,
            manufacturer: this.manufacturer,
            packing: this.packing,
            category: this.category,
            allergen: this.allergen,
            badArgs: this.badArgs,
            goodArgs: this.goodArgs,
            commonInfo: this.commonInfo,
            nutriScore: this.nutriScore,
            ecoScore: this.ecoScore,
            code: this.code
        };
        return outObj;
    };
    return Product;
}());
exports["default"] = Product;
