"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var infoSource_1 = require("./infoSource");
var axios_1 = require("axios");
var cheerio = require("cheerio");
var WebScraper = /** @class */ (function (_super) {
    __extends(WebScraper, _super);
    function WebScraper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.queryUri = "https://de.openfoodfacts.org/produkt/";
        return _this;
    }
    WebScraper.prototype.requestEan = function (ean) {
        return __awaiter(this, void 0, void 0, function () {
            var productQuery;
            var _this = this;
            return __generator(this, function (_a) {
                productQuery = this.queryUri + ean;
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var resultHtml, result, ex_1, resultHtmlStr;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, axios_1["default"].request({
                                            method: 'GET',
                                            url: productQuery,
                                            responseType: 'arraybuffer',
                                            responseEncoding: 'binary'
                                        })];
                                case 1:
                                    result = _a.sent();
                                    resultHtml = result.data;
                                    return [3 /*break*/, 3];
                                case 2:
                                    ex_1 = _a.sent();
                                    console.error(ex_1.message);
                                    throw ("Error whil accessing Product Source!");
                                case 3:
                                    resultHtmlStr = resultHtml.toString("latin1");
                                    console.log(this.generateMinimalProduct(resultHtml));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    WebScraper.prototype.generateMinimalProduct = function (html) {
        var $ = cheerio.load(html);
        var tempObj = {
            error: 0,
            name: "",
            detail: "",
            manufacturer: "",
            mainCat: "",
            subCat: "",
            contents: 0,
            packageInfo: 0,
            description: "",
            origin: "",
            code: ""
        };
        if (!this.checkProductProvided($)) {
            tempObj.error = 1;
            return tempObj;
        }
        tempObj.name = $('.title-1').text();
        tempObj.detail = "";
        // console.log($("#field_quantity_value").text());   //Gewicht/Anzahl
        // console.log($("#field_packaging_value").first().text());   //Verpackung
        // console.log($("#field_brands_value").first().text());     //Hersteller
        // $("#field_categories_value").children().each(function(index:number, child:any) {console.log($(child).text())}); //Kategorien
        //$(".evaluation_bad_title").each(function(index:number, child:any) {console.log($(child).text())}); //Schlechte argumente
        //$(".evaluation_good_title").each(function(index:number, child:any) {console.log($(child).text())});   //Gute argumente
        //$(".evaluation__title").each(function(index:number, child:any) {console.log($(child).text())}); //Allgemeine Informationen:
        //NutriScore Informationen
        $(".grade_a_title").each(function (index, child) { console.log($(child).text()); });
        $(".grade_b_title").each(function (index, child) { console.log($(child).text()); });
        // $(".grade_c_title").each(function(index:number, child:any) {console.log($(child).text())}); 
        // $(".grade_d_title").each(function(index:number, child:any) {console.log("Note D")}); 
        // $(".grade_e_title").each(function(index:number, child:any) {console.log("Note E")}); 
        //$(".allergen").each(function(index:number, child:any){console.log($(child).text())});   //Allergene
        return tempObj;
    };
    WebScraper.prototype.checkProductProvided = function (htmlData) {
        if (htmlData(".if-empty-dnone").text() === "Error") {
            return false;
        }
        else {
            return true;
        }
    };
    return WebScraper;
}(infoSource_1["default"]));
exports["default"] = WebScraper;
