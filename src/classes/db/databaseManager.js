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
var webScraper_1 = require("../eanSource/webScraper");
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager(host, username, password, database) {
        //eanSource: InfoSource = new EanApiController("400000000");
        this.eanSource = new webScraper_1["default"]();
        this.dbConAttempts = 0;
        this.connectionState = false;
        this.host = host;
        this.username = username;
        this.password = password;
        this.database = database;
        this.connect();
    }
    DatabaseManager.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.dbConAttempts++;
                        _a = this;
                        return [4 /*yield*/, mysql.createConnection({
                                host: this.host,
                                user: this.username,
                                password: this.password,
                                database: this.database
                            })];
                    case 1:
                        _a.sqlConnection = _b.sent();
                        this.sqlConnection.connect(function (err) {
                            if (!err) {
                                console.log("Database Connection successfully!");
                                _this.connectionState = true;
                            }
                            else {
                                if (_this.dbConAttempts < 100) {
                                    setTimeout(function () { _this.connect(); }, 1000);
                                }
                                else {
                                    console.log("Connection error!");
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.disconnect = function () {
        this.sqlConnection.end();
    };
    DatabaseManager.prototype.getConnectionState = function () {
        return this.connectionState;
    };
    DatabaseManager.prototype.doQuery = function (queryStr) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.sqlConnection.query(queryStr, function (err, result) {
                                if (err) {
                                    reject(null);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.provideProduct = function (ean) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw ("Not implemented yet");
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
                            this.sqlConnection.query("SELECT id FROM product WHERE Code = ?", [ean], function (error, results, fields) { return __awaiter(_this, void 0, void 0, function () {
                                var checkedRes, Product_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (error) {
                                                console.log("Error: " + error.message);
                                                return [2 /*return*/];
                                            }
                                            checkedRes = [];
                                            if (results !== undefined) {
                                                checkedRes = results;
                                            }
                                            if (!(checkedRes.length === 0)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.eanSource.requestEan(ean)];
                                        case 1:
                                            Product_1 = _a.sent();
                                            if (Product_1.error !== 0) {
                                                reject(Product_1.error);
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, this.addProduct(Product_1)];
                                        case 2:
                                            _a.sent();
                                            this.findProduct(ean).then(function (e) {
                                                resolve(e);
                                            });
                                            return [3 /*break*/, 4];
                                        case 3:
                                            resolve(checkedRes[0].id);
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
            var packingId, manufacturerId, nutriScoreId, ecoScoreId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //TODO: Provide all secundary tables
                        //-Category
                        //-Allergen
                        //-Packing
                        //Category
                        this.provideMultipleSubtable(tables_1["default"].CATEGORY, prod.category);
                        //Allergen
                        this.provideMultipleSubtable(tables_1["default"].ALLERGEN, prod.allergen);
                        return [4 /*yield*/, this.provideSubtable(tables_1["default"].PACKING, prod.packing)];
                    case 1:
                        packingId = _a.sent();
                        return [4 /*yield*/, this.provideSubtable(tables_1["default"].MANUFACTURER, prod.manufacturer)];
                    case 2:
                        manufacturerId = _a.sent();
                        return [4 /*yield*/, this.provideSubtable(tables_1["default"].NUTRISCORE, prod.nutriScore)];
                    case 3:
                        nutriScoreId = _a.sent();
                        return [4 /*yield*/, this.provideSubtable(tables_1["default"].ECOSCORE, prod.ecoScore)];
                    case 4:
                        ecoScoreId = _a.sent();
                        return [4 /*yield*/, this.doQuery("INSERT INTO Product (name, weight, manufacturer, packing, nutriScore, ecoScore) VALUES (\"".concat(prod.name, "\", \"").concat(prod.weight, ", \"").concat(manufacturerId, "\", \"").concat(packingId, "\", \"").concat(nutriScoreId, "\", \"").concat(ecoScoreId, "\")"))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.addToSubtable = function (tab, word) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sqlQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableName = this.resolveTablesName(tab);
                        sqlQuery = "INSERT INTO ".concat(tableName, " VALUES (").concat(word, ");");
                        return [4 /*yield*/, this.sqlConnection.query(sqlQuery)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.checkSubTable = function (tab, word) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.resolveTablesName(tab);
                sqlQuery = "SELECT id FROM ".concat(tableName, " WHERE name = ").concat(word);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.sqlConnection.query(sqlQuery)];
                                case 1:
                                    result = _a.sent();
                                    if (result.length === 0) {
                                        resolve(parseInt(result[0]));
                                    }
                                    else {
                                        resolve(-1);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.provideMultipleSubtable = function (tab, word) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < word.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.provideSubtable(tab, word[i])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.provideSubtable = function (tab, word) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkSubTable(tab, word)];
                    case 1:
                        id = _a.sent();
                        if (!(id === -1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addToSubtable(tab, word)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.provideSubtable(tab, word)];
                    case 3: return [2 /*return*/, id];
                }
            });
        });
    };
    DatabaseManager.prototype.addContableEntry = function (helpTable, productId, elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sqlQuery, checkQuery;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.resolveHelptableName(helpTable);
                sqlQuery = "INSERT INTO ".concat(tableName, " (productId, elementId) VALUES (").concat(productId, ", ").concat(elementId, ");");
                checkQuery = "SELECT id FROM ".concat(tableName, " WHERE productId = ").concat(productId, " AND elementId = ").concat(elementId, ";");
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var checkResult;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    _a.sent(); //Insert Query
                                    return [4 /*yield*/, this.doQuery(checkQuery)];
                                case 2:
                                    checkResult = _a.sent();
                                    resolve(parseInt(checkResult[0]));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.processConnectionArr = function (helpTable, productId, elementIds) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < elementIds.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.addContableEntry(helpTable, productId, elementIds[i])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.getConnectionId = function (helpTable, productId, elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.resolveHelptableName(helpTable);
                sqlQuery = "SELECT id FROM ".concat(tableName, " WHERE productId = ").concat(productId, " AND elementId = ").concat(elementId, ";");
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    result = _a.sent();
                                    if (result.length === 0) {
                                        resolve(-1);
                                    }
                                    else {
                                        resolve(parseInt(result[0]));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.resolveTablesName = function (tab) {
        switch (tab) {
            case tables_1["default"].PRODUCT:
                return "Product";
                break;
            case tables_1["default"].ALLERGEN:
                return "Allergen";
                break;
            case tables_1["default"].CATEGORY:
                return "Category";
                break;
            case tables_1["default"].ECOSCORE:
                return "Score";
                break;
            case tables_1["default"].NUTRISCORE:
                return "NutriScore";
                break;
            case tables_1["default"].PACKING:
                return "Packing";
                break;
            case tables_1["default"].MANUFACTURER:
                return "Manufacturer";
                break;
            default:
                throw ("The input is not a Table!");
                break;
        }
    };
    DatabaseManager.prototype.resolveHelptableName = function (tab) {
        switch (tab) {
            case tables_1.HelpTables.ProductAllergen:
                return "ProductAllergen";
                break;
            case tables_1.HelpTables.ProductArgument:
                return "ProductArgument";
                break;
            case tables_1.HelpTables.ProductCategory:
                return "ProductCategory";
                break;
            default:
                throw ("The input is not a HelpTable");
        }
    };
    DatabaseManager.prototype.proveIsNotNaN = function (nr) {
        if (nr === null) {
            return null;
        }
        else if (isNaN(nr)) {
            return null;
        }
        else {
            return nr;
        }
    };
    DatabaseManager.prototype.generateErrorObj = function (errorCode) {
        return ({
            error: errorCode,
            code: "",
            name: "",
            weight: "",
            manufacturer: "",
            packing: "",
            category: [],
            allergen: [],
            badArgs: [],
            goodArgs: [],
            commonInfo: [],
            nutriScore: "",
            ecoScore: ""
        });
    };
    return DatabaseManager;
}());
exports["default"] = DatabaseManager;
