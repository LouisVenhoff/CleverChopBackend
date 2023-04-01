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
        this.name = product.name;
        this.weight = product.weight;
        this.manufacturer = product.manufacturer;
        this.packing = product.packing;
        this.category = product.category;
        this.allergen = product.allergen;
        this.badArgs = product.badArgs;
        this.goodArgs = product.goodArgs;
        this.commonInfo = product.commonInfo;
        this.nutriScore = product.nutriScore;
        this.ecoScore = product.ecoScore;
        this.code = product.code;
    }
    // public setCode(code:string)
    // {
    //     this.code = code;
    // }
    Product.prototype.reduceObj = function () {
        return this.minProduct;
    };
    return Product;
}());
exports["default"] = Product;
