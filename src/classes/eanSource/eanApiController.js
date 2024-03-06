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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Product_1 = require("../static/Product");
var infoSource_1 = require("./infoSource");
var EanApiController = /** @class */ (function (_super) {
    __extends(EanApiController, _super);
    function EanApiController(_userId) {
        var _this = _super.call(this) || this;
        _this._userId = _userId;
        return _this;
    }
    EanApiController.prototype.requestEan = function (ean) {
        return __awaiter(this, void 0, void 0, function () {
            var queryString;
            var _this = this;
            return __generator(this, function (_a) {
                queryString = "http://opengtindb.org/?ean=".concat(ean, "&cmd=query&queryid=").concat(this._userId);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var result, outObj, Err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, axios_1.default.request({
                                            method: 'GET',
                                            url: queryString,
                                            responseType: 'arraybuffer',
                                            responseEncoding: 'binary'
                                        })];
                                case 1:
                                    result = _a.sent();
                                    outObj = new Product_1.default(this.rawToMinProduct(result.data.toString("latin1"), ean));
                                    outObj.code = ean;
                                    resolve(outObj.reduceObj());
                                    return [3 /*break*/, 3];
                                case 2:
                                    Err_1 = _a.sent();
                                    console.log(Err_1.message);
                                    reject(null);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    EanApiController.prototype.rawToMinProduct = function (rawString, ean) {
        var outProd = Product_1.default.getEmptyMinimalProduct(); //Der Produktname wird aus dem String gefiltert und einem neuen leeren Minimalprodukt zugewiesen
        outProd.code = ean;
        var cleanedInfo = rawString.split("\n");
        for (var i = 0; i < cleanedInfo.length; i++) {
            var infoPair = cleanedInfo[i].split("=");
            if (infoPair[0] === "name") {
                outProd.name = infoPair[1];
                break;
            }
        }
        return outProd;
    };
    return EanApiController;
}(infoSource_1.default));
exports.default = EanApiController;
