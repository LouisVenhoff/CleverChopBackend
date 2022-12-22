"use strict";
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
var mysql = require("mysql");
var tables_1 = require("../../enums/tables");
var eanApiController_1 = require("../openEan/eanApiController");
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager(host, username, password) {
        this.eanSource = new eanApiController_1["default"]("400000000");
        this.host = host;
        this.username = username;
        this.password = password;
        this.connect();
    }
    DatabaseManager.prototype.connect = function () {
        this.sqlConnection = mysql.createConnection({
            host: this.host,
            user: this.username,
            password: this.password,
            database: "heroku_554b26e8f85d455"
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
    DatabaseManager.prototype.provideProduct = function (ean) {
        return __awaiter(this, void 0, void 0, function () {
            var productId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findProduct(ean)];
                    case 1:
                        productId = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.sqlConnection.query("SELECT Name, Detail, Code, Content, Pack, Description, Origin, Category.category as MainCat, Subcategory.Category as SubCat FROM Product\n                                                                    JOIN Origin ON Origin.id = Product.originId\n                                                                    JOIN category ON Category.id = Product.catId\n                                                                    JOIN subcategory ON Subcategory.id = Product.SubCatId\n                                                                    WHERE Product.id = \"".concat(productId, "\";"), function (error, results, fields) {
                                                    if (results.length === 0) {
                                                        console.log("Article Not Found!");
                                                    }
                                                    var loadedItem = {
                                                        error: 0,
                                                        name: results[0].Name,
                                                        detail: results[0].Detail,
                                                        code: results[0].Code,
                                                        contents: results[0].Content,
                                                        packageInfo: results[0],
                                                        description: results[0].Description,
                                                        origin: results[0].Origin,
                                                        mainCat: results[0].MainCat,
                                                        subCat: results[0].SubCat,
                                                        manufacturer: ""
                                                    };
                                                    resolve(loadedItem);
                                                })];
                                        case 1:
                                            _b.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = _b.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    DatabaseManager.prototype.findProduct = function (ean) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.sqlConnection.query("SELECT id FROM Product WHERE Code = '".concat(ean, "'"), function (error, results, fields) { return __awaiter(_this, void 0, void 0, function () {
                                var Product_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(results.length === 0)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.eanSource.requestEan(ean)];
                                        case 1:
                                            Product_1 = _a.sent();
                                            return [4 /*yield*/, this.addProduct(Product_1)];
                                        case 2:
                                            _a.sent();
                                            this.findProduct(ean).then(function (e) {
                                                resolve(e);
                                            });
                                            return [3 /*break*/, 4];
                                        case 3:
                                            resolve(results[0].id);
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.addProduct = function (prod) {
        return __awaiter(this, void 0, void 0, function () {
            var mainCatId, subCatId, originId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provideSecTable(prod.mainCat, tables_1["default"].CATEGORY)];
                    case 1:
                        mainCatId = _a.sent();
                        return [4 /*yield*/, this.provideSecTable(prod.subCat, tables_1["default"].SUBCATEGORY)];
                    case 2:
                        subCatId = _a.sent();
                        return [4 /*yield*/, this.provideSecTable(prod.origin, tables_1["default"].ORIGIN)];
                    case 3:
                        originId = _a.sent();
                        return [4 /*yield*/, this.sqlConnection.query("INSERT INTO product (Name, Detail, Code, Content, Pack, Description, OriginId, CatId, SubCatId)" +
                                "VALUES ('".concat(prod.name, "', '").concat(prod.detail, "', '").concat(prod.code, "', '").concat(prod.contents, "', '").concat(prod.packageInfo, "', '").concat(prod.description, "', '").concat(originId, "', '").concat(mainCatId, "', '").concat(subCatId, "')"))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.addToSecTable = function (value, table) {
        return __awaiter(this, void 0, void 0, function () {
            var catType, tableName;
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dbConfig;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    dbConfig = this.getSecTableConfig(table);
                                    return [4 /*yield*/, this.sqlConnection.query("INSERT INTO ".concat(dbConfig.tableName, " (").concat(dbConfig.catType, ") VALUES ('").concat(value, "')"), function (error, results, fields) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (error) {
                                                    resolve(false);
                                                }
                                                else {
                                                    resolve(true);
                                                }
                                                return [2 /*return*/];
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.checkSecTable = function (value, table) {
        return __awaiter(this, void 0, void 0, function () {
            var dbConfig;
            var _this = this;
            return __generator(this, function (_a) {
                dbConfig = this.getSecTableConfig(table);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.sqlConnection.query("SELECT id FROM ".concat(dbConfig.tableName, " WHERE ").concat(dbConfig.catType, " = '").concat(value, "'"), function (error, result, fields) {
                                        if (result.length > 0) {
                                            resolve(parseInt(result[0].id));
                                        }
                                        else {
                                            resolve(0);
                                        }
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.provideSecTable = function (value, table) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var secId, finalId, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.checkSecTable(value, table)];
                                case 1:
                                    secId = _b.sent();
                                    if (!(secId === 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.addToSecTable(value, table)];
                                case 2:
                                    _b.sent();
                                    _a = resolve;
                                    return [4 /*yield*/, this.checkSecTable(value, table)];
                                case 3:
                                    _a.apply(void 0, [_b.sent()]);
                                    return [3 /*break*/, 5];
                                case 4:
                                    resolve(secId);
                                    _b.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.getSecTableConfig = function (table) {
        var catType;
        var tableName;
        switch (table) {
            case tables_1["default"].CATEGORY:
                catType = "Category";
                tableName = "category";
                break;
            case tables_1["default"].SUBCATEGORY:
                catType = "Category";
                tableName = "subcategory";
                break;
            case tables_1["default"].ORIGIN:
                catType = "Origin";
                tableName = "origin";
                break;
            default:
                return null;
        }
        return { catType: catType, tableName: tableName };
    };
    return DatabaseManager;
}());
exports["default"] = DatabaseManager;
