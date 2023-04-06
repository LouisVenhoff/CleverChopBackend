"use strict";
exports.__esModule = true;
exports.HelpTables = void 0;
var Tables;
(function (Tables) {
    Tables[Tables["CATEGORY"] = 0] = "CATEGORY";
    Tables[Tables["MANUFACTURER"] = 1] = "MANUFACTURER";
    Tables[Tables["PACKING"] = 2] = "PACKING";
    Tables[Tables["ALLERGEN"] = 3] = "ALLERGEN";
    Tables[Tables["ECOSCORE"] = 4] = "ECOSCORE";
    Tables[Tables["NUTRISCORE"] = 5] = "NUTRISCORE";
    Tables[Tables["PRODUCT"] = 6] = "PRODUCT";
    Tables[Tables["ARGUMENTS"] = 7] = "ARGUMENTS";
    Tables[Tables["EFFECT"] = 8] = "EFFECT";
})(Tables || (Tables = {}));
var HelpTables;
(function (HelpTables) {
    HelpTables[HelpTables["ProductCategory"] = 0] = "ProductCategory";
    HelpTables[HelpTables["ProductArgument"] = 1] = "ProductArgument";
    HelpTables[HelpTables["ProductAllergen"] = 2] = "ProductAllergen";
})(HelpTables || (HelpTables = {}));
exports.HelpTables = HelpTables;
exports["default"] = Tables;
