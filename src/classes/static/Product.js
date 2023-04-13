"use strict";
exports.__esModule = true;
var Product = /** @class */ (function () {
    function Product(product) {
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
        this.minProduct = product;
        this.error = product.error;
        this.writeArgsSafe(this.name, product.name);
        this.writeArgsSafe(this.weight, product.weight);
        this.writeArgsSafe(this.manufacturer, product.manufacturer);
        this.writeArgsSafe(this.packing, product.packing);
        this.writeArgsSafe(this.category, product.category);
        this.writeArgsSafe(this.allergen, product.allergen);
        this.writeArgsSafe(this.badArgs, product.badArgs);
        this.writeArgsSafe(this.goodArgs, product.goodArgs);
        this.writeArgsSafe(this.commonInfo, product.commonInfo);
        this.writeArgsSafe(this.nutriScore, product.nutriScore);
        this.writeArgsSafe(this.ecoScore, product.ecoScore);
        this.writeArgsSafe(this.code, product.code);
    }
    // public setCode(code:string)
    // {
    //     this.code = code;
    // }
    Product.prototype.reduceObj = function () {
        return this.minProduct;
    };
    Product.prototype.writeArgsSafe = function (arg, input) {
        if (input !== undefined) {
            arg = input;
        }
    };
    return Product;
}());
exports["default"] = Product;
