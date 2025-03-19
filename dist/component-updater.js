"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldUpdate = void 0;
var lodash_get_1 = __importDefault(require("lodash.get"));
var lodash_isequal_1 = __importDefault(require("lodash.isequal"));
function shouldUpdate(a, b, paths) {
    for (var i = 0; i < paths.length; i++) {
        var equals = (0, lodash_isequal_1.default)((0, lodash_get_1.default)(a, paths[i]), (0, lodash_get_1.default)(b, paths[i]));
        if (!equals) {
            return true;
        }
    }
    return false;
}
exports.shouldUpdate = shouldUpdate;
