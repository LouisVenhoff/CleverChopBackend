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
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var tables_1 = require("../../enums/tables");
var eanApiController_1 = require("../eanSource/eanApiController");
var webScraper_1 = require("../eanSource/webScraper");
var strhelper_1 = require("../helpers/strhelper");
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager(config) {
        this.altEanSource = new eanApiController_1.default("400000000");
        this.eanSource = new webScraper_1.default();
        this.dbConAttempts = 0;
        this.connectionState = false;
        this.host = config.host;
        this.username = config.username;
        this.password = config.password;
        this.database = config.database;
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
                                database: this.database,
                            })];
                    case 1:
                        _a.sqlConnection = _b.sent();
                        this.sqlConnection.connect(function (err) {
                            if (!err) {
                                console.log("Database Connection successfully!");
                                _this.connectionState = true;
                            }
                            else {
                                if (_this.dbConAttempts < 10) {
                                    setTimeout(function () { _this.connect(); }, 1000);
                                }
                                else {
                                    console.log("Connection error!", err);
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
                                    reject(err);
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
            var sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                sqlQuery = "SELECT product.id as id, product.name, code, weight, manufacturer.name as manufacturer, packing.name as packing, nutriScore.name as nutriScore, ecoScore.name as ecoScore \n    FROM product\n    JOIN manufacturer ON manufacturer.id = manufacturer \n    JOIN packing ON packing.id = packing\n    JOIN nutriScore ON nutriScore.id = nutriScore\n    JOIN ecoScore ON ecoScore.id = ecoScore\n    WHERE code = ".concat(ean);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var results, commonArgs, badArgs, goodArgs, allergens, categorys, outElement, newProduct;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    results = _a.sent();
                                    if (!(results.length != 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, this.getArguments("common", results[0].id)];
                                case 2:
                                    commonArgs = _a.sent();
                                    return [4 /*yield*/, this.getArguments("bad", results[0].id)];
                                case 3:
                                    badArgs = _a.sent();
                                    return [4 /*yield*/, this.getArguments("good", results[0].id)];
                                case 4:
                                    goodArgs = _a.sent();
                                    return [4 /*yield*/, this.getAllergens(results[0].id)];
                                case 5:
                                    allergens = _a.sent();
                                    return [4 /*yield*/, this.getCategorys(results[0].id)];
                                case 6:
                                    categorys = _a.sent();
                                    outElement = {
                                        error: 0,
                                        code: results[0].code,
                                        name: results[0].name,
                                        weight: results[0].weight,
                                        manufacturer: results[0].manufacturer,
                                        packing: results[0].packing,
                                        category: categorys,
                                        allergen: allergens,
                                        badArgs: badArgs,
                                        goodArgs: goodArgs,
                                        commonInfo: commonArgs,
                                        nutriScore: results[0].nutriScore,
                                        ecoScore: results[0].ecoScore,
                                    };
                                    resolve(outElement);
                                    return [3 /*break*/, 12];
                                case 7: return [4 /*yield*/, this.eanSource.requestEan(ean)];
                                case 8:
                                    newProduct = _a.sent();
                                    if (!(newProduct.error > 0)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, this.altEanSource.requestEan(ean)];
                                case 9:
                                    newProduct = _a.sent();
                                    _a.label = 10;
                                case 10: return [4 /*yield*/, this.addProduct(newProduct)];
                                case 11:
                                    _a.sent();
                                    resolve(newProduct);
                                    _a.label = 12;
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.fetchBackup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryString;
            var _this = this;
            return __generator(this, function (_a) {
                queryString = "SELECT code from product";
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var result, outArr, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.doQuery(queryString)];
                                case 1:
                                    result = _a.sent();
                                    outArr = [];
                                    for (i = 0; i < result.length; i++) {
                                        outArr.push(result[i].code);
                                    }
                                    resolve(outArr);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
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
                                var checkedRes, currentProduct;
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
                                            if (!(checkedRes.length === 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.eanSource.requestEan(ean)];
                                        case 1:
                                            currentProduct = _a.sent();
                                            this.addProduct(currentProduct);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            resolve(checkedRes[0].id);
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
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
            var emptyArr, allArgs, packingId, manufacturerId, nutriScoreId, ecoScoreId, productId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //TODO: Provide all secundary tables
                    //-Category
                    //-Allergen
                    //-Packing
                    //Category
                    return [4 /*yield*/, this.provideMultipleSubtable(tables_1.default.CATEGORY, prod.category)];
                    case 1:
                        //TODO: Provide all secundary tables
                        //-Category
                        //-Allergen
                        //-Packing
                        //Category
                        _a.sent();
                        //Allergen
                        return [4 /*yield*/, this.provideMultipleSubtable(tables_1.default.ALLERGEN, prod.allergen)];
                    case 2:
                        //Allergen
                        _a.sent();
                        //Arguments
                        return [4 /*yield*/, this.provideMultipleArguments("average", prod.commonInfo)];
                    case 3:
                        //Arguments
                        _a.sent();
                        return [4 /*yield*/, this.provideMultipleArguments("bad", prod.badArgs)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.provideMultipleArguments("good", prod.goodArgs)];
                    case 5:
                        _a.sent();
                        this.checkArgumentArr(prod.commonInfo);
                        this.checkArgumentArr(prod.badArgs);
                        this.checkArgumentArr(prod.goodArgs);
                        emptyArr = [];
                        allArgs = emptyArr.concat(prod.badArgs, prod.goodArgs, prod.commonInfo);
                        return [4 /*yield*/, this.provideSubtable(tables_1.default.PACKING, prod.packing)];
                    case 6:
                        packingId = _a.sent();
                        return [4 /*yield*/, this.provideSubtable(tables_1.default.MANUFACTURER, prod.manufacturer)];
                    case 7:
                        manufacturerId = _a.sent();
                        return [4 /*yield*/, this.provideSubtable(tables_1.default.NUTRISCORE, prod.nutriScore)];
                    case 8:
                        nutriScoreId = _a.sent();
                        return [4 /*yield*/, this.provideSubtable(tables_1.default.ECOSCORE, prod.ecoScore)];
                    case 9:
                        ecoScoreId = _a.sent();
                        return [4 /*yield*/, this.doQuery("INSERT INTO product (name, code,  weight, manufacturer, packing, nutriScore, ecoScore) VALUES (\"".concat(prod.name, "\", \"").concat(prod.code, "\" ,\"").concat(prod.weight, "\", ").concat(manufacturerId, ", ").concat(packingId, ", ").concat(nutriScoreId, ", ").concat(ecoScoreId, ");"))];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.findProduct(prod.code)];
                    case 11:
                        productId = _a.sent();
                        if (!(prod.category.length !== 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.createConnectionArr(tables_1.HelpTables.ProductCategory, tables_1.default.CATEGORY, productId, prod.category)];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        if (!(prod.allergen.length !== 0)) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.createConnectionArr(tables_1.HelpTables.ProductAllergen, tables_1.default.ALLERGEN, productId, prod.allergen)];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15:
                        if (!(allArgs.length !== 0)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.createConnectionArr(tables_1.HelpTables.ProductArgument, tables_1.default.ARGUMENTS, productId, allArgs)];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.checkArgumentArr = function (processStr) {
        if (processStr === undefined) {
            processStr = [];
        }
    };
    DatabaseManager.prototype.addToSubtable = function (tab, word) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, sqlQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableName = this.resolveTablesName(tab);
                        sqlQuery = "INSERT INTO ".concat(tableName, " (name) VALUES (\"").concat(word, "\");");
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
            var tableName, columnName, sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                tableName = this.resolveTablesName(tab);
                columnName = "name";
                if (tab == tables_1.default.ARGUMENTS) {
                    columnName = "text";
                }
                sqlQuery = "SELECT id FROM ".concat(tableName, " WHERE ").concat(columnName, " = \"").concat(strhelper_1.default.cleanString(word), "\";");
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    result = _a.sent();
                                    if (result.length !== 0) {
                                        resolve(parseInt(result[0].id));
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
                        if (word === undefined) {
                            return [2 /*return*/];
                        }
                        if (word.length === 0) {
                            return [2 /*return*/];
                        }
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
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var id, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (word === "" || word === undefined) {
                                        resolve(null);
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, this.checkSubTable(tab, word)];
                                case 1:
                                    id = _b.sent();
                                    if (!(id === -1)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.addToSubtable(tab, word)];
                                case 2:
                                    _b.sent();
                                    _a = resolve;
                                    return [4 /*yield*/, this.provideSubtable(tab, word)];
                                case 3:
                                    _a.apply(void 0, [_b.sent()]);
                                    return [3 /*break*/, 5];
                                case 4:
                                    resolve(id);
                                    _b.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.provideMultipleArguments = function (effect, text) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                if (text === undefined) {
                    return [2 /*return*/];
                }
                if (text.length === 0) {
                    return [2 /*return*/];
                }
                for (i = 0; i < text.length; i++) {
                    this.provideArgumentSubtable(effect, text[i]);
                }
                return [2 /*return*/];
            });
        });
    };
    DatabaseManager.prototype.provideArgumentSubtable = function (effect, text) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var checkResult, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.checkArgumentSubtable(text)];
                                case 1:
                                    checkResult = _b.sent();
                                    if (!(checkResult != -1)) return [3 /*break*/, 2];
                                    resolve(checkResult);
                                    return [3 /*break*/, 4];
                                case 2:
                                    _a = resolve;
                                    return [4 /*yield*/, this.addArgument(effect, text)];
                                case 3:
                                    _a.apply(void 0, [_b.sent()]);
                                    _b.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.checkArgumentSubtable = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                sqlQuery = "SELECT id FROM argument WHERE text = \"".concat(strhelper_1.default.cleanString(text), "\"");
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    results = _a.sent();
                                    if (results.length == 0) {
                                        resolve(-1);
                                    }
                                    else {
                                        resolve(parseInt(results[0]));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.addArgument = function (effect, argument) {
        return __awaiter(this, void 0, void 0, function () {
            var effectId, cleanedArgument, sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provideSubtable(tables_1.default.EFFECT, effect)];
                    case 1:
                        effectId = _a.sent();
                        cleanedArgument = strhelper_1.default.cleanString(argument);
                        sqlQuery = "INSERT INTO argument (text, effectId) VALUES (\"".concat(cleanedArgument, "\",\"").concat(effectId, "\")");
                        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.doQuery(sqlQuery)];
                                        case 1:
                                            _b.sent();
                                            _a = resolve;
                                            return [4 /*yield*/, this.checkArgumentSubtable(argument)];
                                        case 2:
                                            _a.apply(void 0, [_b.sent()]);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
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
                sqlQuery = "INSERT INTO ".concat(tableName, " (productId, elementId) VALUES (\"").concat(productId, "\", \"").concat(elementId, "\");");
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
    DatabaseManager.prototype.createConnectionArr = function (helpTable, subTable, productId, elements) {
        return __awaiter(this, void 0, void 0, function () {
            var i, elementId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < elements.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.provideSubtable(subTable, elements[i])];
                    case 2:
                        elementId = _a.sent();
                        if (elementId === null) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, this.addContableEntry(helpTable, productId, elementId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
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
    DatabaseManager.prototype.getAllConnectionIds = function (helpTabs, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                sqlQuery = "SELECT id FROM ".concat(this.resolveHelptableName(helpTabs), " WHERE productId = ").concat(productId);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var results, resultNumbers, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    results = _a.sent();
                                    resultNumbers = [];
                                    for (i = 0; i < results.length; i++) {
                                        resultNumbers.push(parseInt(results[i]));
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
            case tables_1.default.PRODUCT:
                return "product";
                break;
            case tables_1.default.ALLERGEN:
                return "allergen";
                break;
            case tables_1.default.CATEGORY:
                return "category";
                break;
            case tables_1.default.ECOSCORE:
                return "ecoScore";
                break;
            case tables_1.default.NUTRISCORE:
                return "nutriScore";
                break;
            case tables_1.default.PACKING:
                return "packing";
                break;
            case tables_1.default.MANUFACTURER:
                return "manufacturer";
                break;
            case tables_1.default.EFFECT:
                return "effect";
                break;
            case tables_1.default.ARGUMENTS:
                return "argument";
            default:
                throw ("The input is not a Table!");
                break;
        }
    };
    DatabaseManager.prototype.resolveHelptableName = function (tab) {
        switch (tab) {
            case tables_1.HelpTables.ProductAllergen:
                return "productAllergen";
                break;
            case tables_1.HelpTables.ProductArgument:
                return "productArgument";
                break;
            case tables_1.HelpTables.ProductCategory:
                return "productCategory";
                break;
            case tables_1.HelpTables.ProductArgument:
                return "productArgument";
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
            ecoScore: "",
        });
    };
    DatabaseManager.prototype.getArguments = function (effect, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                sqlQuery = "SELECT argument.text \n    FROM argument\n    JOIN productArgument ON argument.id = productArgument.elementid\n    JOIN product ON productId = product.id\n    JOIN effect ON argument.effectId = effect.id\n    WHERE effect.name = \"".concat(effect, "\"\n    AND product.id = ").concat(productId, ";");
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var outArr, results, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    outArr = [];
                                    return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    results = _a.sent();
                                    if (results.length == 0) {
                                        resolve(outArr);
                                    }
                                    for (i = 0; i < results.length; i++) {
                                        outArr.push(results[i].text);
                                    }
                                    resolve(outArr);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.getAllergens = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                sqlQuery = "SELECT allergen.name\n      FROM allergen\n      JOIN productAllergen ON allergen.id = productAllergen.elementId\n      JOIN product ON product.id = productAllergen.productId\n      WHERE product.id = ".concat(productId, ";");
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var allergens, results, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    allergens = [];
                                    return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    results = _a.sent();
                                    for (i = 0; i < results.length; i++) {
                                        allergens.push(results[i].name);
                                    }
                                    resolve(allergens);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DatabaseManager.prototype.getCategorys = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlQuery;
            var _this = this;
            return __generator(this, function (_a) {
                sqlQuery = "SELECT category.name \n    FROM category\n    JOIN productCategory ON category.id = productCategory.elementId\n    JOIN product ON product.id = productCategory.productId\n    WHERE product.id = ".concat(productId, ";");
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var categorys, results, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    categorys = [];
                                    return [4 /*yield*/, this.doQuery(sqlQuery)];
                                case 1:
                                    results = _a.sent();
                                    for (i = 0; i < results.length; i++) {
                                        categorys.push(results[i].name);
                                    }
                                    resolve(categorys);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return DatabaseManager;
}());
exports.default = DatabaseManager;
