"use strict";
exports.__esModule = true;
var StrHelper = /** @class */ (function () {
    function StrHelper() {
    }
    StrHelper.cleanString = function (input) {
        var output = input.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').replace(/\\+/g, '');
        return output;
    };
    return StrHelper;
}());
exports["default"] = StrHelper;
