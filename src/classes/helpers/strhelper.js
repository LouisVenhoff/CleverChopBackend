"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StrHelper = /** @class */ (function () {
    function StrHelper() {
    }
    StrHelper.cleanString = function (input) {
        try {
            var output = input.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').replace(/\\+/g, '');
            return output;
        }
        catch (_a) {
            return null;
        }
    };
    return StrHelper;
}());
exports.default = StrHelper;
